// src/app/(dashboard)/dashboard/invoices/page.tsx
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, Eye, Edit, Download, FileText, ShoppingCart, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data
const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'FV-00000001',
    invoiceType: 'SALE',
    clientName: 'Empresa ABC C.A.',
    clientRif: 'J-12345678-9',
    issueDate: '2024-12-02',
    dueDate: '2024-12-17',
    subtotal: 10000.00,
    taxAmount: 1600.00,
    retentionIva: 750.00,
    retentionIslr: 300.00,
    total: 11600.00,
    status: 'PENDING',
    items: [
      { id: '1', description: 'Servicio de consultoría', quantity: 1, unitPrice: 10000.00, total: 10000.00, taxRate: 16 }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'FC-00000001',
    invoiceType: 'PURCHASE',
    clientName: 'Proveedor XYZ S.R.L.',
    clientRif: 'J-98765432-1',
    issueDate: '2024-12-01',
    dueDate: '2024-12-16',
    subtotal: 5000.00,
    taxAmount: 800.00,
    retentionIva: 0.00,
    retentionIslr: 0.00,
    total: 5800.00,
    status: 'PAID',
    items: [
      { id: '2', description: 'Material de oficina', quantity: 10, unitPrice: 500.00, total: 5000.00, taxRate: 16 }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'FV-00000002',
    invoiceType: 'SALE',
    clientName: 'Cliente DEF C.A.',
    clientRif: 'J-11223344-5',
    issueDate: '2024-11-30',
    dueDate: '2024-12-15',
    subtotal: 7500.00,
    taxAmount: 1200.00,
    retentionIva: 0.00,
    retentionIslr: 450.00,
    total: 8700.00,
    status: 'CANCELLED',
    items: [
      { id: '3', description: 'Producto premium', quantity: 3, unitPrice: 2500.00, total: 7500.00, taxRate: 16 }
    ]
  },
  {
    id: '4',
    invoiceNumber: 'FV-00000003',
    invoiceType: 'SALE',
    clientName: 'Corporación GHI C.A.',
    clientRif: 'J-55667788-9',
    issueDate: '2024-11-28',
    dueDate: '2024-12-13',
    subtotal: 15000.00,
    taxAmount: 2400.00,
    retentionIva: 1125.00,
    retentionIslr: 900.00,
    total: 17400.00,
    status: 'PAID',
    items: [
      { id: '4', description: 'Servicio de desarrollo', quantity: 1, unitPrice: 15000.00, total: 15000.00, taxRate: 16 }
    ]
  }
]

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'PAID':
        return <Badge variant="default" className="bg-green-100 text-green-800">Pagada</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Anulada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInvoiceTypeIcon = (type: string) => {
    return type === 'SALE' ? (
      <FileText className="h-4 w-4 text-blue-600" />
    ) : (
      <ShoppingCart className="h-4 w-4 text-green-600" />
    )
  }

  const getInvoiceTypeLabel = (type: string) => {
    return type === 'SALE' ? 'Venta' : 'Compra'
  }

  const filterInvoices = (invoices: any[], type?: string) => {
    return invoices.filter(invoice => {
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (invoice.clientRif && invoice.clientRif.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = !selectedStatus || invoice.status === selectedStatus
      const matchesType = !type || invoice.invoiceType === type
      
      return matchesSearch && matchesStatus && matchesType
    })
  }

  const handleDownloadPDF = (invoiceId: string) => {
    toast({
      title: "Descargando PDF",
      description: "El archivo PDF se está generando..."
    })
  }

  const handleUpdateStatus = (invoiceId: string, newStatus: string) => {
    toast({
      title: "Estado actualizado",
      description: `La factura ha sido marcada como ${newStatus.toLowerCase()}.`
    })
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    toast({
      title: "Factura eliminada",
      description: "La factura ha sido eliminada exitosamente."
    })
    setShowDeleteDialog(null)
  }

  const salesInvoices = filterInvoices(mockInvoices, 'SALE')
  const purchaseInvoices = filterInvoices(mockInvoices, 'PURCHASE')
  const allInvoices = filterInvoices(mockInvoices)

  const renderInvoicesTable = (invoices: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente/Proveedor</TableHead>
          <TableHead>Fecha Emisión</TableHead>
          <TableHead>Fecha Vencimiento</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
          <TableHead className="text-right">IVA</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {getInvoiceTypeIcon(invoice.invoiceType)}
                <div>
                  <span className="font-mono text-sm">{invoice.invoiceNumber}</span>
                  <div className="text-xs text-muted-foreground">
                    {getInvoiceTypeLabel(invoice.invoiceType)}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium text-sm">{invoice.clientName}</div>
                {invoice.clientRif && (
                  <div className="text-xs text-muted-foreground font-mono">{invoice.clientRif}</div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {new Date(invoice.issueDate).toLocaleDateString('es-VE')}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('es-VE') : '-'}
              </div>
            </TableCell>
            <TableCell className="text-right font-mono text-sm">
              Bs. {invoice.subtotal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell className="text-right font-mono text-sm">
              Bs. {invoice.taxAmount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell className="text-right font-mono font-semibold">
              Bs. {invoice.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell>
              {getStatusBadge(invoice.status)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedInvoice(invoice)}
                  title="Ver detalles"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" asChild title="Editar">
                  <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDownloadPDF(invoice.id)}
                  title="Descargar PDF"
                >
                  <Download className="h-4 w-4" />
                </Button>
                {invoice.status === 'PENDING' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleUpdateStatus(invoice.id, 'PAID')}
                    className="text-green-600"
                    title="Marcar como pagada"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                {invoice.status !== 'CANCELLED' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDeleteDialog(invoice.id)}
                    className="text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {invoices.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
              No se encontraron facturas que coincidan con los filtros
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
          <p className="text-muted-foreground">
            Gestiona las facturas de venta y compra de tu empresa
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/invoices/new?type=purchase">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Nueva Compra
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/invoices/new?type=sale">
              <FileText className="mr-2 h-4 w-4" />
              Nueva Venta
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra las facturas por número, cliente o estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, cliente o RIF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="PAID">Pagada</SelectItem>
                <SelectItem value="CANCELLED">Anulada</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSelectedStatus('')
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pestañas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Todas ({allInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Ventas ({salesInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Compras ({purchaseInvoices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Facturas</CardTitle>
              <CardDescription>
                Lista completa de facturas de venta y compra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderInvoicesTable(allInvoices)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Facturas de Venta</CardTitle>
              <CardDescription>
                Facturas emitidas a clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderInvoicesTable(salesInvoices)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Facturas de Compra</CardTitle>
              <CardDescription>
                Facturas recibidas de proveedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderInvoicesTable(purchaseInvoices)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              Bs. {salesInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString('es-VE')}
            </div>
            <p className="text-xs text-muted-foreground">
              {salesInvoices.length} facturas de venta
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Bs. {purchaseInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString('es-VE')}
            </div>
            <p className="text-xs text-muted-foreground">
              {purchaseInvoices.length} facturas de compra
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              Bs. {salesInvoices.filter(inv => inv.status === 'PENDING').reduce((sum, inv) => sum + inv.total, 0).toLocaleString('es-VE')}
            </div>
            <p className="text-xs text-muted-foreground">
              {salesInvoices.filter(inv => inv.status === 'PENDING').length} facturas pendientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IVA Recaudado</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              Bs. {allInvoices.reduce((sum, inv) => sum + inv.taxAmount, 0).toLocaleString('es-VE')}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de IVA en facturas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalles de Factura */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getInvoiceTypeIcon(selectedInvoice.invoiceType)}
                Factura {selectedInvoice.invoiceNumber}
              </DialogTitle>
              <DialogDescription>
                Detalles completos de la factura
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tipo:</span>
                      <span>{getInvoiceTypeLabel(selectedInvoice.invoiceType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha de Emisión:</span>
                      <span>{new Date(selectedInvoice.issueDate).toLocaleDateString('es-VE')}</span>
                    </div>
                    {selectedInvoice.dueDate && (
                      <div className="flex justify-between">
                        <span>Fecha de Vencimiento:</span>
                        <span>{new Date(selectedInvoice.dueDate).toLocaleDateString('es-VE')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <span>{getStatusBadge(selectedInvoice.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Cliente/Proveedor</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">{selectedInvoice.clientName}</span>
                    </div>
                    {selectedInvoice.clientRif && (
                      <div className="font-mono text-muted-foreground">
                        RIF: {selectedInvoice.clientRif}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="font-semibold">Detalles de Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Cant.</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">% IVA</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-mono">
                          Bs. {item.unitPrice.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">{item.taxRate}%</TableCell>
                        <TableCell className="text-right font-mono">
                          Bs. {item.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totales */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-mono">
                        Bs. {selectedInvoice.subtotal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IVA:</span>
                      <span className="font-mono">
                        Bs. {selectedInvoice.taxAmount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {selectedInvoice.retentionIva > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Retención IVA:</span>
                        <span className="font-mono">
                          -Bs. {selectedInvoice.retentionIva.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    {selectedInvoice.retentionIslr > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Retención ISLR:</span>
                        <span className="font-mono">
                          -Bs. {selectedInvoice.retentionIslr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span className="font-mono">
                        Bs. {selectedInvoice.total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Confirmación de Eliminación */}
      {showDeleteDialog && (
        <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar factura?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. La factura será eliminada permanentemente.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteInvoice(showDeleteDialog)}
              >
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}