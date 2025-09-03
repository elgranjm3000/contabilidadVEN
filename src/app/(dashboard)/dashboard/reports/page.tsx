// src/app/(dashboard)/dashboard/reports/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  FileText, 
  Download, 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  FileSpreadsheet,
  Calendar,
  Building2
} from 'lucide-react'

const reportCategories = [
  {
    title: 'Reportes Financieros',
    description: 'Estados financieros y análisis contable',
    icon: DollarSign,
    reports: [
      {
        id: 'trial-balance',
        name: 'Balance de Comprobación',
        description: 'Resumen de saldos de todas las cuentas',
        path: '/dashboard/reports/trial-balance'
      },
      {
        id: 'balance-sheet',
        name: 'Balance General',
        description: 'Estado de situación financiera',
        path: '/dashboard/reports/balance-sheet'
      },
      {
        id: 'income-statement',
        name: 'Estado de Resultados',
        description: 'Ganancias y pérdidas del período',
        path: '/dashboard/reports/income-statement'
      },
      {
        id: 'cash-flow',
        name: 'Flujo de Efectivo',
        description: 'Movimientos de efectivo y equivalentes',
        path: '/dashboard/reports/cash-flow'
      }
    ]
  },
  {
    title: 'Reportes de Facturación',
    description: 'Análisis de ventas y compras',
    icon: FileText,
    reports: [
      {
        id: 'sales-report',
        name: 'Reporte de Ventas',
        description: 'Análisis detallado de ventas por período',
        path: '/dashboard/reports/sales'
      },
      {
        id: 'purchases-report',
        name: 'Reporte de Compras',
        description: 'Análisis de compras y proveedores',
        path: '/dashboard/reports/purchases'
      },
      {
        id: 'receivables',
        name: 'Cuentas por Cobrar',
        description: 'Análisis de cartera de clientes',
        path: '/dashboard/reports/receivables'
      },
      {
        id: 'payables',
        name: 'Cuentas por Pagar',
        description: 'Obligaciones pendientes con proveedores',
        path: '/dashboard/reports/payables'
      }
    ]
  },
  {
    title: 'Reportes SENIAT',
    description: 'Reportes para declaraciones fiscales',
    icon: Building2,
    reports: [
      {
        id: 'iva-book-sales',
        name: 'Libro de Ventas IVA',
        description: 'Registro de ventas para declaración de IVA',
        path: '/dashboard/reports/iva-sales'
      },
      {
        id: 'iva-book-purchases',
        name: 'Libro de Compras IVA',
        description: 'Registro de compras para declaración de IVA',
        path: '/dashboard/reports/iva-purchases'
      },
      {
        id: 'islr-report',
        name: 'Reporte ISLR',
        description: 'Retenciones de Impuesto sobre la Renta',
        path: '/dashboard/reports/islr'
      },
      {
        id: 'tax-summary',
        name: 'Resumen Fiscal',
        description: 'Consolidado de obligaciones fiscales',
        path: '/dashboard/reports/tax-summary'
      }
    ]
  },
  {
    title: 'Reportes de Auditoría',
    description: 'Seguimiento y control interno',
    icon: BarChart3,
    reports: [
      {
        id: 'general-ledger',
        name: 'Libro Mayor',
        description: 'Movimientos detallados por cuenta',
        path: '/dashboard/reports/general-ledger'
      },
      {
        id: 'journal-entries',
        name: 'Libro Diario',
        description: 'Cronológico de asientos contables',
        path: '/dashboard/reports/journal-entries'
      },
      {
        id: 'audit-trail',
        name: 'Pista de Auditoría',
        description: 'Registro de cambios y modificaciones',
        path: '/dashboard/reports/audit-trail'
      },
      {
        id: 'user-activity',
        name: 'Actividad de Usuarios',
        description: 'Acciones realizadas por usuarios del sistema',
        path: '/dashboard/reports/user-activity'
      }
    ]
  }
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Genera reportes financieros, fiscales y de auditoría
          </p>
        </div>
      </div>

      {/* Filtros Globales */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Global de Reportes</CardTitle>
          <CardDescription>
            Establece el período base para todos los reportes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Período Predefinido</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Mes Actual</SelectItem>
                  <SelectItem value="last-month">Mes Anterior</SelectItem>
                  <SelectItem value="current-quarter">Trimestre Actual</SelectItem>
                  <SelectItem value="current-year">Año Actual</SelectItem>
                  <SelectItem value="last-year">Año Anterior</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha Desde</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={selectedPeriod !== 'custom'}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha Hasta</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={selectedPeriod !== 'custom'}
              />
            </div>
            <div className="space-y-2">
              <Label>Formato</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorías de Reportes */}
      <div className="space-y-8">
        {reportCategories.map((category) => (
          <div key={category.title}>
            <div className="flex items-center gap-3 mb-4">
              <category.icon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">{category.title}</h2>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {category.reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={report.path}>
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Reporte
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reportes Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Generados Recientemente</CardTitle>
          <CardDescription>
            Historial de reportes generados en los últimos 30 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: 'Balance General',
                date: '2024-12-02',
                format: 'PDF',
                size: '245 KB'
              },
              {
                name: 'Estado de Resultados',
                date: '2024-12-01',
                format: 'Excel',
                size: '128 KB'
              },
              {
                name: 'Libro de Ventas IVA',
                date: '2024-11-30',
                format: 'PDF',
                size: '1.2 MB'
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(report.date).toLocaleDateString('es-VE')} • {report.format} • {report.size}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}