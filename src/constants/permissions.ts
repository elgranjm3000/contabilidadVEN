export const PERMISSIONS = {
  ACCOUNTS: {
    READ: 'accounts:read',
    WRITE: 'accounts:write',
    DELETE: 'accounts:delete'
  },
  JOURNAL: {
    READ: 'journal:read',
    WRITE: 'journal:write',
    APPROVE: 'journal:approve',
    REVERSE: 'journal:reverse'
  },
  INVOICES: {
    READ: 'invoices:read',
    WRITE: 'invoices:write',
    DELETE: 'invoices:delete'
  },
  REPORTS: {
    READ: 'reports:read',
    EXPORT: 'reports:export'
  },
  USERS: {
    READ: 'users:read',
    WRITE: 'users:write',
    INVITE: 'users:invite',
    DELETE: 'users:delete'
  },
  COMPANY: {
    READ: 'company:read',
    WRITE: 'company:write',
    SETTINGS: 'company:settings'
  }
} as const

export const ROLE_PERMISSIONS = {
  ADMIN: [
    ...Object.values(PERMISSIONS.ACCOUNTS),
    ...Object.values(PERMISSIONS.JOURNAL),
    ...Object.values(PERMISSIONS.INVOICES),
    ...Object.values(PERMISSIONS.REPORTS),
    ...Object.values(PERMISSIONS.USERS),
    ...Object.values(PERMISSIONS.COMPANY)
  ],
  ACCOUNTANT: [
    ...Object.values(PERMISSIONS.ACCOUNTS),
    ...Object.values(PERMISSIONS.JOURNAL),
    ...Object.values(PERMISSIONS.INVOICES),
    ...Object.values(PERMISSIONS.REPORTS)
  ],
  AUDITOR: [
    PERMISSIONS.ACCOUNTS.READ,
    PERMISSIONS.JOURNAL.READ,
    PERMISSIONS.INVOICES.READ,
    ...Object.values(PERMISSIONS.REPORTS)
  ],
  USER: [
    PERMISSIONS.ACCOUNTS.READ,
    PERMISSIONS.JOURNAL.READ,
    PERMISSIONS.INVOICES.READ,
    PERMISSIONS.REPORTS.READ
  ]
} as const