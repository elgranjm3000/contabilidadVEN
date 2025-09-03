'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Edit, Eye, RotateCcw, Check, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data
const mockJournalEntries = [
      {
    id: '1',
    entryNumber: 'AS-000001',
    entryDate: '2024-12-02',
    description: 'Registro de venta de mercancía',
    totalDebit: 11600.00,
    totalCredit: 11600.00,
    status: 'APPROVED',
    creator: { firstName: 'Juan', lastName: 'Pérez' },
    details: [
      { account: { code: '1.1.01.001', name: 'Caja' }, debit: 10000, credit: 0 },
      { account: { code: '2.1.01.003', name: 'IVA Débito Fiscal' }, debit: 1600, credit: 0 },
      { account: { code: '4.1.01.001', name: 'Ventas' }, debit: 0, credit: 11600 }
    ]
  },
  {
    id: '2',
    entryNumber: 'AS-000002',
    entryDate: '2024-12-02',
    description: 'Pago a proveedor por compra de mercancía',
    totalDebit: 5000.00,
    totalCredit: 5000.00,
    status: 'DRAFT',
    creator: { firstName: 'María', lastName: 'González' },
    details: [
      { account: { code: '2.1.01.001', name: 'Proveedores' }, debit: 5000, credit: 0 },
      { account: { code: '1.1.01.002', name: 'Banco Cuenta Corriente' }, debit: 0, credit: 5000 }
    ]
  },
  {
    id: '3',
    entryNumber: 'AS-000003',
    entryDate: '2024-12-01',
    description: 'Registro de gastos administrativos',
    totalDebit: 2500.00,
    totalCredit: 2500.00,
    status: 'APPROVED',
    creator: { firstName: 'Carlos', lastName: 'Rodríguez' },
    details: [
      { account: { code: '5.2.01.001', name: 'Gastos Administrativos' }, debit: 2500, credit: 0 },
      { account: { code: '1.1.01.001', name: 'Caja' }, debit: 0, credit: 2500 }
    ]
  }
]

export default function JournalPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const { toast } = useToast()

  const handleApprove = async (entryId: string) => {
    try {
      // Aquí iría la llamada tRPC para aprobar
      toast({
        title: "Asiento aprobado",
        description: "El asiento contable ha sido aprobado exitosamente."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo aprobar el asiento."
      })
    }
  }

  const handleReverse = async (entryId: string) => {
    try {
      // Aquí iría la llamada tRPC para reversar
      toast({
        title: "Asiento reversado",
        description: "El asiento contable ha sido reversado."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo reversar el asiento."
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary">Borrador</Badge>
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-600">Aprobado</Badge>
      case 'REVERSED':
        return <Badge variant="destructive">Reversado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredEntries = mockJournalEntries.filter(entry => {
    const matchesSearch = entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || entry.status === selectedStatus
    const matchesDate = !dateFilter || entry.entryDate === dateFilter
    
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asientos Contables</h1>
          <p className="text-muted-foreground">
            Gestiona los registros contables de la empresa
          </p>
        </div>
        
        <Link href="/dashboard/journal/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Asiento
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra los asientos por número, descripción, estado o fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="APPROVED">Aprobado</SelectItem>
                <SelectItem value="REVERSED">Reversado</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Asientos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Asientos Contables</CardTitle>
          <CardDescription>
            {filteredEntries.length} asiento{filteredEntries.length !== 1 ? 's' : ''} encontrado{filteredEntries.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Débito</TableHead>
                <TableHead className="text-right">Crédito</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium font-mono">
                    {entry.entryNumber}
                  </TableCell>
                  <TableCell>
                    {new Date(entry.entryDate).toLocaleDateString('es-VE')}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.description}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    Bs. {entry.totalDebit.toLocaleString('es-VE', { 
                      minimumFractionDigits: 2 
                    })}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    Bs. {entry.totalCredit.toLocaleString('es-VE', { 
                      minimumFractionDigits: 2 
                    })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(entry.status)}
                  </TableCell>
                  <TableCell>
                    {entry.creator.firstName} {entry.creator.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/journal/${entry.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      {entry.status === 'DRAFT' && (
                        <>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/journal/${entry.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleApprove(entry.id)}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {entry.status === 'APPROVED' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReverse(entry.id)}
                          className="text-red-600"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockJournalEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              Este período
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockJournalEntries.filter(e => e.status === 'APPROVED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockJournalEntries.filter(e => e.status === 'APPROVED').length / mockJournalEntries.length) * 100)}% del total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockJournalEntries.filter(e => e.status === 'DRAFT').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendientes de aprobación
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs. {mockJournalEntries.reduce((sum, entry) => sum + entry.totalDebit, 0).toLocaleString('es-VE')}
            </div>
            <p className="text-xs text-muted-foreground">
              Suma de débitos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}