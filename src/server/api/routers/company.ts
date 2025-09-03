import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/app/lib/trpc'
import { createCompanySchema } from '@/lib/validations/venezuela'

export const companyRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const companies = await ctx.prisma.company.findMany({
      where: {
        companyUsers: {
          some: {
            userId: ctx.session.user.id
          }
        }
      },
      include: {
        companyUsers: {
          where: {
            userId: ctx.session.user.id
          }
        }
      }
    })

    return companies.map(company => ({
      ...company,
      userRole: company.companyUsers[0]?.role
    }))
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.company.findFirst({
        where: {
          id: input.id,
          companyUsers: {
            some: {
              userId: ctx.session.user.id
            }
          }
        },
        include: {
          companyUsers: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      })
    }),

  create: protectedProcedure
    .input(createCompanySchema)
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.prisma.company.create({
        data: input
      })

      // Asociar el usuario actual como administrador
      await ctx.prisma.companyUser.create({
        data: {
          companyId: company.id,
          userId: ctx.session.user.id,
          role: 'ADMIN',
          permissions: {
            accounts: ['read', 'write', 'delete'],
            journal: ['read', 'write', 'approve'],
            invoices: ['read', 'write', 'delete'],
            reports: ['read', 'export']
          }
        }
      })

      return company
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createCompanySchema.partial()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.company.update({
        where: { id: input.id },
        data: input.data
      })
    }),

  getDashboardStats: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [
        totalJournalEntries,
        totalInvoices,
        pendingInvoices,
        currentPeriod
      ] = await Promise.all([
        ctx.prisma.journalEntry.count({
          where: { companyId: input.companyId }
        }),
        ctx.prisma.invoice.count({
          where: { companyId: input.companyId }
        }),
        ctx.prisma.invoice.count({
          where: { 
            companyId: input.companyId,
            status: 'PENDING'
          }
        }),
        ctx.prisma.accountingPeriod.findFirst({
          where: {
            companyId: input.companyId,
            status: 'OPEN'
          },
          orderBy: { createdAt: 'desc' }
        })
      ])

      return {
        totalJournalEntries,
        totalInvoices,
        pendingInvoices,
        currentPeriod
      }
    })
})