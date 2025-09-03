// src/app/(dashboard)/dashboard/reports/trial-balance/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Download, FileText, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock data
const trialBalanceData = [
  {
    account: { code: '1.1.01.001', name: 'Caja' },
    debit: 15000.00,
    credit: 0.00,
    balance: 15000.00
  },
  {
    account: { code: '1.1.01.002', name: 'Banco Cuenta Corriente' },
    debit: 45000.50,
    credit: 5000.00,
    balance: 40000.50
  },
  {
    account: { code: '1.1.02.001', name: 'Clientes' },
    debit: 25000.00,
    credit: 0.00,
    balance: 25000.00
  },
  {
    account: { code: '2.1.01.001', name: 'Proveedores' },
    debit: 0.00,
    credit: 18000.00,
    balance: -18000.00
  },
  {
    account: { code: '2.1.01.003', name: 'IVA Débito Fiscal' },
    debit: 0.00,
    credit: 4800.00,
    balance: -4800.00
  },
  {
    account: { code: '3.1.01.001', name: 'Capital Social' },
    debit: 0.00,
    credit: 50000.00,
    balance: -50000.00
  },
  {
    account: { code: '4.1.01.001', name: 'Ventas' },
    debit: 0.00,
    credit: 30000.00,
    balance: -30000.00
  },
  {
    account: { code: '5.2.01.001', name: 'Gastos Administrativos' },
    debit: 12800.00,
    credit: 0.00,
    balance: 12800.00
  }
]

export default function TrialBalancePage() {
  const router = useRouter()
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0])

  const totalDebit = trialBalanceData.reduce((sum, item) => sum + item.debit, 0)
  const totalCredit = trialBalanceData.reduce((sum, item) => sum + item.credit, 0)

  const handleDownload = () => {
    // Aquí iría la lógica para descargar el reporte
    console.log('Descargando Balance de Comprobación...')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Balance de Comprobación</h1>
            <p className="text-muted-foreground">
              Resumen de saldos de todas las cuentas contables
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <FileText className="mr-2 h-4 w-4" />
            Descargar Excel
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Parámetros del Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asOfDate">Fecha de Corte</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="asOfDate"
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <div className="text-sm">
                <div className="font-medium">Empresa Demo C.A.</div>
                <div className="text-muted-foreground">RIF: J-12345678-9</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Fecha de Generación</Label>
              <div className="text-sm">
                {new Date().toLocaleDateString('es-VE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance de Comprobación */}
      <Card>
        <CardHeader>
          <CardTitle>Balance de Comprobación</CardTitle>
          <CardDescription>
            Al {new Date(asOfDate).toLocaleDateString('es-VE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead className="text-right">Débito</TableHead>
                  <TableHead className="text-right">Crédito</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trialBalanceData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">
                      {item.account.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.account.name}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? `Bs. ${item.debit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? `Bs. ${item.credit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '-'}
                    </TableCell>
                    <TableCell className={`text-right font-mono font-semibold ${
                      item.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Bs. {Math.abs(item.balance).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      {item.balance < 0 && ' (H)'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-semibold">
                    TOTALES
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    Bs. {totalDebit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    Bs. {totalCredit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    <span className={totalDebit === totalCredit ? 'text-green-600' : 'text-red-600'}>
                      {totalDebit === totalCredit ? 'Balanceado' : 'Desbalanceado'}
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Resumen */}
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Débitos</div>
                <div className="font-mono font-semibold text-lg">
                  Bs. {totalDebit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Créditos</div>
                <div className="font-mono font-semibold text-lg">
                  Bs. {totalCredit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Diferencia</div>
                <div className={`font-mono font-semibold text-lg ${
                  totalDebit === totalCredit ? 'text-green-600' : 'text-red-600'
                }`}>
                  Bs. {Math.abs(totalDebit - totalCredit).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="mt-4 text-xs text-muted-foreground">
            <p><strong>Notas:</strong></p>
            <ul className="mt-1 space-y-1 ml-4">
              <li>• Los saldos deudores se muestran en positivo</li>
              <li>• Los saldos acreedores se marcan con (H) y se muestran en rojo</li>
              <li>• Este reporte incluye todas las cuentas con movimientos</li>
              <li>• Fecha de corte: {new Date(asOfDate).toLocaleDateString('es-VE')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}