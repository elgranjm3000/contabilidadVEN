import { z } from 'zod'

export const createAccountSchema = z.object({
  companyId: z.string().uuid(),
  code: z.string().min(1, 'El código es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio').max(200),
  accountTypeId: z.number().int().positive(),
  parentId: z.string().uuid().optional(),
  acceptsEntries: z.boolean().default(true),
  description: z.string().optional()
})

export const createJournalEntrySchema = z.object({
  companyId: z.string().uuid(),
  reference: z.string().optional(),
  description: z.string().min(1, 'La descripción es obligatoria'),
  entryDate: z.date(),
  details: z.array(z.object({
    accountId: z.string().uuid(),
    costCenterId: z.string().uuid().optional(),
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

export const createInvoiceSchema = z.object({
  companyId: z.string().uuid(),
  invoiceType: z.enum(['SALE', 'PURCHASE']),
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio'),
  clientRif: z.string().optional(),
  issueDate: z.date(),
  dueDate: z.date().optional(),
  seniatControlNumber: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, 'La descripción es obligatoria'),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    taxRate: z.number().min(0).max(100).default(16)
  })).min(1, 'Se requiere al menos 1 item')
})