'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2,
  Calculator,
  FileText,
  BarChart3,
  Users,
  Settings,
  Receipt,
  BookOpen,
  Home
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    name: 'Plan de Cuentas',
    href: '/dashboard/accounts',
    icon: BookOpen
  },
  {
    name: 'Asientos Contables',
    href: '/dashboard/journal',
    icon: Calculator
  },
  {
    name: 'Facturación',
    href: '/dashboard/invoices',
    icon: Receipt
  },
  {
    name: 'Reportes',
    href: '/dashboard/reports',
    icon: FileText
  },
  {
    name: 'Empresas',
    href: '/dashboard/companies',
    icon: Building2
  },
  {
    name: 'Usuarios',
    href: '/dashboard/users',
    icon: Users
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings
  }
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Menú Principal
        </h2>
        
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}