import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/app/lib/trpc'

export const accountRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.account.findMany({
        where: { companyId: input.companyId },
        include: {
          accountType: true,
          parent: true,
          children: true
        },
        orderBy: { code: 'asc' }
      })
    }),

  getTree: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const accounts = await ctx.prisma.account.findMany({
        where: { companyId: input.companyId },
        include: {
          accountType: true,
          children: {
            include: {
              children: {
                include: {
                  children: true
                }
              }
            }
          }
        },
        orderBy: { code: 'asc' }
      })

      return accounts.filter(account => !account.parentId)
    }),

  create: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      code: z.string(),
      name: z.string(),
      accountTypeId: z.number(),
      parentId: z.string().optional(),
      acceptsEntries: z.boolean().default(true)
    }))
    .mutation(async ({ ctx, input }) => {
      const level = input.parentId ? 
        await ctx.prisma.account.findUnique({
          where: { id: input.parentId },
          select: { level: true }
        }).then(parent => (parent?.level || 0) + 1) : 1

      return await ctx.prisma.account.create({
        data: {
          ...input,
          level
        }
      })
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string(),
        isActive: z.boolean(),
        acceptsEntries: z.boolean()
      })
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.account.update({
        where: { id: input.id },
        data: input.data
      })
    }),

  getBalance: protectedProcedure
    .input(z.object({
      accountId: z.string(),
      startDate: z.date().optional(),
      endDate: z.date().optional()
    }))
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        accountId: input.accountId
      }

      if (input.startDate || input.endDate) {
        whereClause.journalEntry = {}
        if (input.startDate) {
          whereClause.journalEntry.entryDate = {
            gte: input.startDate
          }
        }
        if (input.endDate) {
          whereClause.journalEntry.entryDate = {
            ...whereClause.journalEntry.entryDate,
            lte: input.endDate
          }
        }
      }

      const details = await ctx.prisma.journalEntryDetail.findMany({
        where: whereClause,
        include: {
          journalEntry: {
            select: {
              status: true,
              entryDate: true
            }
          }
        }
      })

      const approvedDetails = details.filter(d => d.journalEntry.status === 'APPROVED')
      
      const totalDebit = approvedDetails.reduce((sum, d) => sum + Number(d.debit), 0)
      const totalCredit = approvedDetails.reduce((sum, d) => sum + Number(d.credit), 0)

      return {
        debit: totalDebit,
        credit: totalCredit,
        balance: totalDebit - totalCredit
      }
    })
})
