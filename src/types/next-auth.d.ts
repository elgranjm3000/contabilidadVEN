import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      firstName?: string
      lastName?: string
      role?: string
      companies?: Array<{
        id: string
        name: string
        rif: string
        role: string
      }>
    }
  }

  interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    role?: string
    companies?: Array<{
      id: string
      name: string
      rif: string
      role: string
    }>
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    companies?: Array<{
      id: string
      name: string
      rif: string
      role: string
    }>
    firstName?: string
    lastName?: string
  }
}
