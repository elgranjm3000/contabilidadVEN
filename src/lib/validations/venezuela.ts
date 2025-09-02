import { z } from 'zod'

// Validación de RIF venezolano
export const rifSchema = z
  .string()
  .regex(/^[JGVPE]-\d{8}-\d$/, 'Formato de RIF inválido (Ej: J-12345678-9)')
  .transform((val) => val.toUpperCase())

// Validación de teléfono venezolano
export const phoneSchema = z
  .string()
  .regex(/^(0212|0414|0424|0416|0426|0412)\d{7}$/, 'Formato de teléfono inválido')

// Esquema para crear empresa
export const createCompanySchema = z.object({
  rif: rifSchema,
  businessName: z.string().min(1, 'Razón social es obligatoria').max(255),
  commercialName: z.string().max(255).optional(),
  address: z.string().optional(),
  phone: phoneSchema.optional(),
  email: z.string().email('Email inválido').optional(),
  economicActivity: z.string().optional()
})

// Esquema para asientos contables
export const createJournalEntrySchema = z.object({
  companyId: z.string().uuid(),
  reference: z.string().optional(),
  description: z.string().min(1, 'Descripción es obligatoria'),
  entryDate: z.date(),
  details: z.array(z.object({
    accountId: z.string().uuid(),
    description: z.string().optional(),
    debit: z.number().min(0),
    credit: z.number().min(0)
  })).min(2, 'Se requieren al menos 2 detalles')
}).refine((data) => {
  const totalDebit = data.details.reduce((sum, detail) => sum + detail.debit, 0)
  const totalCredit = data.details.reduce((sum, detail) => sum + detail.credit, 0)
  return Math.abs(totalDebit - totalCredit) < 0.01
}, {
  message: 'Los débitos deben ser iguales a los créditos',
  path: ['details']
})