// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// src/lib/validations/venezuela.ts
import { z } from 'zod'

// Validación de RIF venezolano
export const rifSchema = z
  .string()
  .regex(/^[JGVP]-\d{8}-\d$/, 'Formato de RIF inválido (Ej: J-12345678-9)')
  .transform((val) => val.toUpperCase())

// Validación de números de cuenta bancaria
export const bankAccountSchema = z
  .string()
  .regex(/^\d{20}$/, 'El número de cuenta debe tener 20 dígitos')

// Validación de códigos SENIAT
export const seniatActivityCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'El código de actividad económica debe tener 6 dígitos')

// Esquemas para facturación
export const invoiceSchema = z.object({
  companyId: z.string().uuid(),
  invoiceType: z.enum(['SALE', 'PURCHASE']),
  clientRif: rifSchema.optional(),
  clientName: z.string().min(1).max(255),
  issueDate: z.date(),
  dueDate: z.date().optional(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    taxRate: z.number().min(0).max(100).default(16),
  })).min(1),
})

// Utilidades para cálculos contables
export const calculateInvoiceTotal = (items: Array<{
  quantity: number
  unitPrice: number
  taxRate: number
}>) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxAmount = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice
    return sum + (itemTotal * item.taxRate / 100)
  }, 0)
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number((subtotal + taxAmount).toFixed(2))
  }
}

// src/lib/constants/venezuela.ts
export const VENEZUELA_CONSTANTS = {
  CURRENCY: {
    CODE: 'VES',
    SYMBOL: 'Bs.',
    NAME: 'Bolívar Soberano'
  },
  
  TAX_RATES: {
    IVA: {
      GENERAL: 16,
      REDUCED: 8,
      EXEMPT: 0
    },
    ISLR: {
      COMPANIES: 34,
      INDIVIDUALS: 6
    }
  },
  
  RIF_TYPES: [
    { code: 'J', name: 'Jurídico (Empresas)' },
    { code: 'G', name: 'Gubernamental' },
    { code: 'V', name: 'Venezolano (Persona Natural)' },
    { code: 'E', name: 'Extranjero' }
  ],
  
  ACCOUNT_TYPES: [
    { id: 1, code: '1', name: 'ACTIVO', nature: 'DEBIT' },
    { id: 2, code: '2', name: 'PASIVO', nature: 'CREDIT' },
    { id: 3, code: '3', name: 'PATRIMONIO', nature: 'CREDIT' },
    { id: 4, code: '4', name: 'INGRESOS', nature: 'CREDIT' },
    { id: 5, code: '5', name: 'GASTOS', nature: 'DEBIT' }
  ],
  
  DEFAULT_CHART_OF_ACCOUNTS: [
    // ACTIVOS
    { code: '1.1', name: 'ACTIVO CORRIENTE' },
    { code: '1.1.01', name: 'EFECTIVO Y EQUIVALENTES' },
    { code: '1.1.01.001', name: 'Caja' },
    { code: '1.1.01.002', name: 'Banco Cuenta Corriente' },
    { code: '1.1.02', name: 'CUENTAS POR COBRAR' },
    { code: '1.1.02.001', name: 'Clientes' },
    { code: '1.1.02.002', name: 'IVA Crédito Fiscal' },
    { code: '1.1.03', name: 'INVENTARIOS' },
    { code: '1.1.03.001', name: 'Mercancía' },
    
    // PASIVOS
    { code: '2.1', name: 'PASIVO CORRIENTE' },
    { code: '2.1.01', name: 'CUENTAS POR PAGAR' },
    { code: '2.1.01.001', name: 'Proveedores' },
    { code: '2.1.01.002', name: 'IVA Débito Fiscal' },
    { code: '2.1.02', name: 'RETENCIONES POR PAGAR' },
    { code: '2.1.02.001', name: 'Retención IVA por Pagar' },
    { code: '2.1.02.002', name: 'Retención ISLR por Pagar' },
    
    // PATRIMONIO
    { code: '3.1', name: 'CAPITAL' },
    { code: '3.1.01.001', name: 'Capital Social' },
    { code: '3.2', name: 'RESULTADOS' },
    { code: '3.2.01.001', name: 'Resultados Acumulados' },
    { code: '3.2.01.002', name: 'Resultado del Ejercicio' },
    
    // INGRESOS
    { code: '4.1', name: 'INGRESOS OPERACIONALES' },
    { code: '4.1.01.001', name: 'Ventas' },
    { code: '4.2', name: 'OTROS INGRESOS' },
    { code: '4.2.01.001', name: 'Ingresos Financieros' },
    
    // GASTOS
    { code: '5.1', name: 'COSTO DE VENTAS' },
    { code: '5.1.01.001', name: 'Costo de Mercancía Vendida' },
    { code: '5.2', name: 'GASTOS OPERACIONALES' },
    { code: '5.2.01.001', name: 'Gastos Administrativos' },
    { code: '5.2.01.002', name: 'Gastos de Ventas' },
    { code: '5.3', name: 'GASTOS FINANCIEROS' },
    { code: '5.3.01.001', name: 'Intereses y Comisiones Bancarias' }
  ]
}

// src/hooks/use-company.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Company {
  id: string
  businessName: string
  rif: string
  role: string
}

interface CompanyStore {
  selectedCompany: Company | null
  companies: Company[]
  setSelectedCompany: (company: Company) => void
  setCompanies: (companies: Company[]) => void
}

export const useCompany = create<CompanyStore>()(
  persist(
    (set) => ({
      selectedCompany: null,
      companies: [],
      setSelectedCompany: (company) => set({ selectedCompany: company }),
      setCompanies: (companies) => set({ companies }),
    }),
    {
      name: 'company-storage',
    }
  )
)