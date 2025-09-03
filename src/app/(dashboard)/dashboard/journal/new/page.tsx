'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface JournalEntryDetail {
  id: string
  accountId: string
  account?: { code: string; name: string }
  description: string
  debit: number
  credit: number
}

export default function NewJournalEntryPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [journalEntry, setJournalEntry] = useState({
    reference: '',
    description: '',
    entryDate: new Date().toISOString().split('T')[0],
  })
  
  const [details, setDetails] = useState<JournalEntryDetail[]>([
    { id: '1', accountId: '', description: '', debit: 0, credit: 0 },
    { id: '2', accountId: '', description: '', debit: 0, credit: 0 }
  ])

  // Mock accounts - en la implementación real vendría de tRPC
  const accounts = [
    { id: '1', code: '1.1.01.001', name: 'Caja' },
    { id: '2', code: '1.1.01.002', name: 'Banco Cuenta Corriente' },
    { id: '3', code: '2.1.01.001', name: 'Proveedores' },
    { id: '4', code: '4.1.01.001', name: 'Ventas' },
    { id: '5', code: '5.2.01.001', name: 'Gastos Administrativos' }
  ]

  const addDetail = () => {
    setDetails([...details, {
      id: Date.now().toString(),
      accountId: '',
      description: '',
      debit: 0,
      credit: 0
    }])
  }

  const removeDetail = (id: string) => {
    if (details.length > 2) {
      setDetails(details.filter(detail => detail.id !== id))
    }
  }

  const updateDetail = (id: string, field: keyof JournalEntryDetail, value: any) => {
    setDetails(details.map(detail => 
      detail.id === id 
        ? { 
            ...detail, 
            [field]: value,
            ...(field === 'accountId' && value ? {
              account: accounts.find(acc => acc.id === value)
            } : {})
          } 
        : detail
    ))
  }

  const getTotalDebit = () => details.reduce((sum, detail) => sum + detail.debit, 0)
  const getTotalCredit = () => details.reduce((sum, detail) => sum + detail.credit, 0)
  const isBalanced = () => Math.abs(getTotalDebit() - getTotalCredit()) < 0.01
  const canSave = () => isBalanced() && journalEntry.description && details.every(d => d.accountId)

  const handleSave = async (status: 'DRAFT' | 'APPROVED') => {
    if (!canSave()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El asiento debe estar balanceado y tener todos los campos requeridos."
      })
      return
    }

    try {
      // Aquí iría la llamada tRPC
      toast({
        title: "Asiento guardado",
        description: `El asiento ha sido guardado como ${status === 'DRAFT' ? 'borrador' : 'aprobado'}.`
      })
      router.push('/dashboard/journal')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el asiento."
      })
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Asiento Contable</h1>
            <p className="text-muted-foreground">
              Crea un nuevo registro contable
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSave('DRAFT')}
            disabled={!canSave()}
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button 
            onClick={() => handleSave('APPROVED')}
            disabled={!canSave()}
          >
            Aprobar y Guardar
          </Button>
        </div>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryDate">Fecha del Asiento</Label>
              <Input
                id="entryDate"
                type="date"
                value={journalEntry.entryDate}
                onChange={(e) => setJournalEntry({...journalEntry, entryDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Referencia (Opcional)</Label>
              <Input
                id="reference"
                placeholder="Ej: Factura #001"
                value={journalEntry.reference}
                onChange={(e) => setJournalEntry({...journalEntry, reference: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Descripción del asiento"
                value={journalEntry.description}
                onChange={(e) => setJournalEntry({...journalEntry, description: e.target.value})}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles del Asiento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detalles del Asiento</CardTitle>
            <CardDescription>
              Configura las cuentas que serán afectadas
            </CardDescription>
          </div>
          <Button onClick={addDetail} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Línea
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Débito</TableHead>
                  <TableHead className="text-right">Crédito</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="min-w-[250px]">
                      <Select
                        value={detail.accountId}
                        onValueChange={(value) => updateDetail(detail.id, 'accountId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cuenta" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Descripción específica"
                        value={detail.description}
                        onChange={(e) => updateDetail(detail.id, 'description', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={detail.debit || ''}
                        onChange={(e) => updateDetail(detail.id, 'debit', parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={detail.credit || ''}
                        onChange={(e) => updateDetail(detail.id, 'credit', parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDetail(detail.id)}
                        disabled={details.length <= 2}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totales */}
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-end space-x-8">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Débito</div>
                <div className="text-lg font-semibold">
                  Bs. {getTotalDebit().toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Crédito</div>
                <div className="text-lg font-semibold">
                  Bs. {getTotalCredit().toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Diferencia</div>
                <div className={`text-lg font-semibold ${isBalanced() ? 'text-green-600' : 'text-red-600'}`}>
                  Bs. {Math.abs(getTotalDebit() - getTotalCredit()).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            {!isBalanced() && (
              <div className="mt-2 text-center text-sm text-red-600">
                ⚠️ El asiento debe estar balanceado (Débitos = Créditos)
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}