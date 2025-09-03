import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/app/lib/trpc'
import bcrypt from 'bcryptjs'

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        twoFactorEnabled: true,
        createdAt: true,
        companyUsers: {
          include: {
            company: {
              select: {
                id: true,
                businessName: true,
                rif: true
              }
            }
          }
        }
      }
    })
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input
      })
    }),

  changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6)
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id }
      })

      if (!user?.passwordHash) {
        throw new Error('Usuario no encontrado')
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        input.currentPassword, 
        user.passwordHash
      )

      if (!isCurrentPasswordValid) {
        throw new Error('Contraseña actual incorrecta')
      }

      const hashedNewPassword = await bcrypt.hash(input.newPassword, 10)

      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { passwordHash: hashedNewPassword }
      })
    }),

  getCompanyUsers: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.companyUser.findMany({
        where: { companyId: input.companyId },
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
      })
    }),

  inviteUser: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      email: z.string().email(),
      role: z.enum(['ADMIN', 'ACCOUNTANT', 'AUDITOR', 'USER']),
      permissions: z.record(z.array(z.string())).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar si el usuario ya existe
      let user = await ctx.prisma.user.findUnique({
        where: { email: input.email }
      })

      // Si no existe, crear usuario temporal
      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            role: input.role
          }
        })
      }

      // Crear relación con la empresa
      return await ctx.prisma.companyUser.create({
        data: {
          companyId: input.companyId,
          userId: user.id,
          role: input.role,
          permissions: input.permissions || {}
        },
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
      })
    }),

  updateUserRole: protectedProcedure
    .input(z.object({
      companyUserId: z.string(),
      role: z.enum(['ADMIN', 'ACCOUNTANT', 'AUDITOR', 'USER']),
      permissions: z.record(z.array(z.string())).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.companyUser.update({
        where: { id: input.companyUserId },
        data: {
          role: input.role,
          permissions: input.permissions
        }
      })
    }),

  removeUser: protectedProcedure
    .input(z.object({ companyUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.companyUser.delete({
        where: { id: input.companyUserId }
      })
    })
})