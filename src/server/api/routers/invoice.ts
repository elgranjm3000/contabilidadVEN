import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/app/lib/trpc'

export const invoiceRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      page: z.number().default(1),
      limit: z.number().default(20),
      invoiceType: z.enum(['SALE', 'PURCHASE']).optional(),
      status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional()
    }))
    .query(async ({ ctx, input }) => {
      const where: any = { companyId: input.companyId }
      
      if (input.invoiceType) where.invoiceType = input.invoiceType
      if (input.status) where.status = input.status
      if (input.startDate || input.endDate) {
        where.issueDate = {}
        if (input.startDate) where.issueDate.gte = input.startDate
        if (input.endDate) where.issueDate.lte = input.endDate
      }

      const [invoices, total] = await Promise.all([
        ctx.prisma.invoice.findMany({
          where,
          include: {
            items: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit
        }),
        ctx.prisma.invoice.count({ where })
      ])

      return {
        invoices,
        total,
        pages: Math.ceil(total / input.limit)
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findUnique({
        where: { id: input.id },
        include: {
          items: true,
          company: true
        }
      })
    }),

  create: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      invoiceType: z.enum(['SALE', 'PURCHASE']),
      clientRif: z.string().optional(),
      clientName: z.string(),
      issueDate: z.date(),
      dueDate: z.date().optional(),
      seniatControlNumber: z.string().optional(),
      items: z.array(z.object({
        description: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
        taxRate: z.number().min(0).max(100).default(16)
      }))
    }))
    .mutation(async ({ ctx, input }) => {
      // Generar número de factura
      const prefix = input.invoiceType === 'SALE' ? 'FV' : 'FC'
      const lastInvoice = await ctx.prisma.invoice.findFirst({
        where: { 
          companyId: input.companyId,
          invoiceType: input.invoiceType
        },
        orderBy: { invoiceNumber: 'desc' }
      })

      const nextNumber = lastInvoice 
        ? String(parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1).padStart(8, '0')
        : '00000001'

      // Calcular totales
      const subtotal = input.items.reduce((sum, item) => 
        sum + (item.quantity * item.unitPrice), 0)
      
      const taxAmount = input.items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.unitPrice
        return sum + (itemTotal * item.taxRate / 100)
      }, 0)

      return await ctx.prisma.invoice.create({
        data: {
          companyId: input.companyId,
          invoiceNumber: `${prefix}-${nextNumber}`,
          invoiceType: input.invoiceType,
          clientRif: input.clientRif,
          clientName: input.clientName,
          issueDate: input.issueDate,
          dueDate: input.dueDate,
          seniatControlNumber: input.seniatControlNumber,
          subtotal,
          taxAmount,
          total: subtotal + taxAmount,
          items: {
            create: input.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
              taxRate: item.taxRate
            }))
          }
        },
        include: {
          items: true
        }
      })
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
      retentionIva: z.number().optional(),
      retentionIslr: z.number().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input
      return await ctx.prisma.invoice.update({
        where: { id },
        data: updateData
      })
    }),

  getSalesReport: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      startDate: z.date(),
      endDate: z.date()
    }))
    .query(async ({ ctx, input }) => {
      const sales = await ctx.prisma.invoice.findMany({
        where: {
          companyId: input.companyId,
          invoiceType: 'SALE',
          issueDate: {
            gte: input.startDate,
            lte: input.endDate
          }
        },
        include: {
          items: true
        }
      })

      const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total), 0)
      const totalTax = sales.reduce((sum, sale) => sum + Number(sale.taxAmount), 0)
      const totalRetentions = sales.reduce((sum, sale) => 
        sum + Number(sale.retentionIva) + Number(sale.retentionIslr), 0)

      return {
        sales,
        summary: {
          totalSales,
          totalTax,
          totalRetentions,
          netAmount: totalSales - totalRetentions,
          count: sales.length
        }
      }
    }),

  getPurchasesReport: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      startDate: z.date(),
      endDate: z.date()
    }))
    .query(async ({ ctx, input }) => {
      const purchases = await ctx.prisma.invoice.findMany({
        where: {
          companyId: input.companyId,
          invoiceType: 'PURCHASE',
          issueDate: {
            gte: input.startDate,
            lte: input.endDate
          }
        },
        include: {
          items: true
        }
      })

      const totalPurchases = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0)
      const totalTax = purchases.reduce((sum, purchase) => sum + Number(purchase.taxAmount), 0)

      return {
        purchases,
        summary: {
          totalPurchases,
          totalTax,
          count: purchases.length
        }
      }
    })
})