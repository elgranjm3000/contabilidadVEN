import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/app/lib/trpc'
import { createJournalEntrySchema } from '@/lib/validations/venezuela'

export const journalRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      page: z.number().default(1),
      limit: z.number().default(20),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      status: z.enum(['DRAFT', 'APPROVED', 'REVERSED']).optional()
    }))
    .query(async ({ ctx, input }) => {
      const where: any = { companyId: input.companyId }
      
      if (input.startDate || input.endDate) {
        where.entryDate = {}
        if (input.startDate) where.entryDate.gte = input.startDate
        if (input.endDate) where.entryDate.lte = input.endDate
      }
      
      if (input.status) where.status = input.status

      const [entries, total] = await Promise.all([
        ctx.prisma.journalEntry.findMany({
          where,
          include: {
            details: {
              include: {
                account: {
                  select: {
                    code: true,
                    name: true
                  }
                }
              }
            },
            creator: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit
        }),
        ctx.prisma.journalEntry.count({ where })
      ])

      return {
        entries,
        total,
        pages: Math.ceil(total / input.limit)
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.journalEntry.findUnique({
        where: { id: input.id },
        include: {
          details: {
            include: {
              account: true,
              costCenter: true
            }
          },
          creator: true,
          approver: true
        }
      })
    }),

  create: protectedProcedure
    .input(createJournalEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const totalDebit = input.details.reduce((sum, d) => sum + d.debit, 0)
      const totalCredit = input.details.reduce((sum, d) => sum + d.credit, 0)

      // Generar número de asiento
      const lastEntry = await ctx.prisma.journalEntry.findFirst({
        where: { companyId: input.companyId },
        orderBy: { entryNumber: 'desc' }
      })

      const nextNumber = lastEntry 
        ? String(parseInt(lastEntry.entryNumber.split('-')[1]) + 1).padStart(6, '0')
        : '000001'

      return await ctx.prisma.journalEntry.create({
        data: {
          companyId: input.companyId,
          entryNumber: `AS-${nextNumber}`,
          reference: input.reference,
          description: input.description,
          entryDate: input.entryDate,
          totalDebit,
          totalCredit,
          createdBy: ctx.session.user.id,
          details: {
            create: input.details.map(detail => ({
              accountId: detail.accountId,
              description: detail.description,
              debit: detail.debit,
              credit: detail.credit
            }))
          }
        },
        include: {
          details: {
            include: {
              account: true
            }
          }
        }
      })
    }),

  approve: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.journalEntry.update({
        where: { id: input.id },
        data: {
          status: 'APPROVED',
          approvedBy: ctx.session.user.id,
          approvedAt: new Date()
        }
      })
    }),

  reverse: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      reason: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const originalEntry = await ctx.prisma.journalEntry.findUnique({
        where: { id: input.id },
        include: { details: true }
      })

      if (!originalEntry) throw new Error('Asiento no encontrado')

      // Crear asiento de reverso
      const lastEntry = await ctx.prisma.journalEntry.findFirst({
        where: { companyId: originalEntry.companyId },
        orderBy: { entryNumber: 'desc' }
      })

      const nextNumber = lastEntry 
        ? String(parseInt(lastEntry.entryNumber.split('-')[1]) + 1).padStart(6, '0')
        : '000001'

      await ctx.prisma.journalEntry.create({
        data: {
          companyId: originalEntry.companyId,
          entryNumber: `RV-${nextNumber}`,
          reference: `Reverso de ${originalEntry.entryNumber}`,
          description: `REVERSO: ${originalEntry.description}. Motivo: ${input.reason}`,
          entryDate: new Date(),
          totalDebit: originalEntry.totalCredit,
          totalCredit: originalEntry.totalDebit,
          createdBy: ctx.session.user.id,
          status: 'APPROVED',
          approvedBy: ctx.session.user.id,
          approvedAt: new Date(),
          details: {
            create: originalEntry.details.map(detail => ({
              accountId: detail.accountId,
              description: `Reverso: ${detail.description}`,
              debit: detail.credit,
              credit: detail.debit
            }))
          }
        }
      })

      // Marcar original como revertido
      return await ctx.prisma.journalEntry.update({
        where: { id: input.id },
        data: { status: 'REVERSED' }
      })
    })
})