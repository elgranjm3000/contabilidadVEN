import { createTRPCRouter } from '@/app/lib/trpc'
import { companyRouter } from './routers/company'
import { accountRouter } from './routers/account'
import { journalRouter } from './routers/journal'
import { invoiceRouter } from './routers/invoice'
import { reportRouter } from './routers/report'
import { userRouter } from './routers/user'

export const appRouter = createTRPCRouter({
  company: companyRouter,
  account: accountRouter,
  journal: journalRouter,
  invoice: invoiceRouter,
  report: reportRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter