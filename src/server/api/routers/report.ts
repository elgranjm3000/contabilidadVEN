import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/app/lib/trpc'

export const reportRouter = createTRPCRouter({
  getTrialBalance: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      asOfDate: z.date()
    }))
    .query(async ({ ctx, input }) => {
      const accounts = await ctx.prisma.account.findMany({
        where: { 
          companyId: input.companyId,
          acceptsEntries: true
        },
        include: {
          accountType: true,
          journalEntryDetails: {
            where: {
              journalEntry: {
                status: 'APPROVED',
                entryDate: {
                  lte: input.asOfDate
                }
              }
            }
          }
        },
        orderBy: { code: 'asc' }
      })

      return accounts.map(account => {
        const totalDebit = account.journalEntryDetails.reduce(
          (sum, detail) => sum + Number(detail.debit), 0)
        const totalCredit = account.journalEntryDetails.reduce(
          (sum, detail) => sum + Number(detail.credit), 0)

        return {
          account: {
            id: account.id,
            code: account.code,
            name: account.name,
            type: account.accountType.name,
            nature: account.accountType.nature
          },
          debit: totalDebit,
          credit: totalCredit,
          balance: account.accountType.nature === 'DEBIT' 
            ? totalDebit - totalCredit 
            : totalCredit - totalDebit
        }
      }).filter(item => item.debit !== 0 || item.credit !== 0 || item.balance !== 0)
    }),

  getBalanceSheet: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      asOfDate: z.date()
    }))
    .query(async ({ ctx, input }) => {
      const accounts = await ctx.prisma.account.findMany({
        where: { companyId: input.companyId },
        include: {
          accountType: true,
          journalEntryDetails: {
            where: {
              journalEntry: {
                status: 'APPROVED',
                entryDate: {
                  lte: input.asOfDate
                }
              }
            }
          }
        }
      })

      const balanceSheet = {
        assets: [] as any[],
        liabilities: [] as any[],
        equity: [] as any[],
        totalAssets: 0,
        totalLiabilities: 0,
        totalEquity: 0
      }

      accounts.forEach(account => {
        const totalDebit = account.journalEntryDetails.reduce(
          (sum, detail) => sum + Number(detail.debit), 0)
        const totalCredit = account.journalEntryDetails.reduce(
          (sum, detail) => sum + Number(detail.credit), 0)

        let balance = 0
        if (account.accountType.nature === 'DEBIT') {
          balance = totalDebit - totalCredit
        } else {
          balance = totalCredit - totalDebit
        }

        if (balance !== 0) {
          const accountData = {
            code: account.code,
            name: account.name,
            balance: Math.abs(balance)
          }

          switch (account.accountType.id) {
            case 1: // ACTIVO
              balanceSheet.assets.push(accountData)
              balanceSheet.totalAssets += Math.abs(balance)
              break
            case 2: // PASIVO
              balanceSheet.liabilities.push(accountData)
              balanceSheet.totalLiabilities += Math.abs(balance)
              break
            case 3: // PATRIMONIO
              balanceSheet.equity.push(accountData)
              balanceSheet.totalEquity += Math.abs(balance)
              break
          }
        }
      })

      return balanceSheet
    }),

  getIncomeStatement: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      startDate: z.date(),
      endDate: z.date()
    }))
    .query(async ({ ctx, input }) => {
      const accounts = await ctx.prisma.account.findMany({
        where: { 
          companyId: input.companyId,
          accountType: {
            id: {
              in: [4, 5] // INGRESOS y GASTOS
            }
          }
        },
        include: {
          accountType: true,
          journalEntryDetails: {
            where: {
              journalEntry: {
                status: 'APPROVED',
                entryDate: {
                  gte: input.startDate,
                  lte: input.endDate
                }
              }
            }
          }
        }
      })

      const incomeStatement = {
        revenues: [] as any[],
        expenses: [] as any[],
        totalRevenues: 0,
        totalExpenses: 0,
        netIncome: 0
      }

      accounts.forEach(account => {
        const totalDebit = account.journalEntryDetails.reduce(
          (sum, detail) => sum + Number(detail.debit), 0)
        const totalCredit = account.journalEntryDetails.reduce(
          (sum, detail) => sum + Number(detail.credit), 0)

        let balance = 0
        if (account.accountType.nature === 'DEBIT') {
          balance = totalDebit - totalCredit
        } else {
          balance = totalCredit - totalDebit
        }

        if (balance !== 0) {
          const accountData = {
            code: account.code,
            name: account.name,
            balance: Math.abs(balance)
          }

          if (account.accountType.id === 4) { // INGRESOS
            incomeStatement.revenues.push(accountData)
            incomeStatement.totalRevenues += Math.abs(balance)
          } else if (account.accountType.id === 5) { // GASTOS
            incomeStatement.expenses.push(accountData)
            incomeStatement.totalExpenses += Math.abs(balance)
          }
        }
      })

      incomeStatement.netIncome = incomeStatement.totalRevenues - incomeStatement.totalExpenses

      return incomeStatement
    }),

  getGeneralLedger: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      accountId: z.string().optional(),
      startDate: z.date(),
      endDate: z.date()
    }))
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        journalEntry: {
          companyId: input.companyId,
          status: 'APPROVED',
          entryDate: {
            gte: input.startDate,
            lte: input.endDate
          }
        }
      }

      if (input.accountId) {
        whereClause.accountId = input.accountId
      }

      const entries = await ctx.prisma.journalEntryDetail.findMany({
        where: whereClause,
        include: {
          journalEntry: {
            select: {
              entryNumber: true,
              entryDate: true,
              description: true
            }
          },
          account: {
            select: {
              code: true,
              name: true,
              accountType: true
            }
          }
        },
        orderBy: [
          { account: { code: 'asc' } },
          { journalEntry: { entryDate: 'asc' } }
        ]
      })

      return entries
    }),

  getCashFlow: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      startDate: z.date(),
      endDate: z.date()
    }))
    .query(async ({ ctx, input }) => {
      // Obtener cuentas de efectivo
      const cashAccounts = await ctx.prisma.account.findMany({
        where: {
          companyId: input.companyId,
          code: {
            startsWith: '1.1.01' // Efectivo y equivalentes
          }
        },
        include: {
          journalEntryDetails: {
            where: {
              journalEntry: {
                status: 'APPROVED',
                entryDate: {
                  gte: input.startDate,
                  lte: input.endDate
                }
              }
            },
            include: {
              journalEntry: {
                select: {
                  entryDate: true,
                  description: true
                }
              }
            }
          }
        }
      })

      const cashFlowData = cashAccounts.map(account => {
        const movements = account.journalEntryDetails.map(detail => ({
          date: detail.journalEntry.entryDate,
          description: detail.journalEntry.description,
          inflow: Number(detail.debit),
          outflow: Number(detail.credit),
          netFlow: Number(detail.debit) - Number(detail.credit)
        }))

        const totalInflow = movements.reduce((sum, m) => sum + m.inflow, 0)
        const totalOutflow = movements.reduce((sum, m) => sum + m.outflow, 0)

        return {
          account: {
            code: account.code,
            name: account.name
          },
          movements,
          totalInflow,
          totalOutflow,
          netCashFlow: totalInflow - totalOutflow
        }
      })

      return cashFlowData
    }),

  getAuditTrail: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      userId: z.string().optional(),
      action: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        companyId: input.companyId,
        createdAt: {
          gte: input.startDate,
          lte: input.endDate
        }
      }

      if (input.userId) where.userId = input.userId
      if (input.action) where.action = input.action

      return await ctx.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 1000
      })
    })
})