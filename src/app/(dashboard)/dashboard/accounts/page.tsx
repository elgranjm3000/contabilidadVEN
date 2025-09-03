// src/app/(dashboard)/dashboard/accounts/page.tsx
'use client'

import { useState } from 'react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Edit, Eye, Trash2, FolderOpen, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data - en la implementación real vendría de tRPC
const mockAccounts = [
  {
    id: '1',
    code: '1',
    name: 'ACTIVO',
    accountType: { name: 'ACTIVO', nature: 'DEBIT' },
    level: 1,
    isActive: true,
    acceptsEntries: false,
    balance: 125000.50,
    children: [
      {
        id: '2',
        code: '1.1',
        name: 'ACTIVO CORRIENTE',
        level: 2,
        acceptsEntries: false,
        children: [
          {
            id: '3',
            code: '1.1.01',
            name: 'EFECTIVO Y EQUIVALENTES',
            level: 3,
            acceptsEntries: false,
            children: [
              {
                id: '4',
                code: '1.1.01.001',
                name: 'Caja',
                level: 4,
                acceptsEntries: true,
                balance: 5000.00
              },
              {
                id: '5',
                code: '1.1.01.002',
                name: 'Banco Cuenta Corriente',
                level: 4,
                acceptsEntries: true,
                balance: 45000.50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '6',
    code: '2',
    name: 'PASIVO',
    accountType: { name: 'PASIVO', nature: 'CREDIT' },
    level: 1,
    isActive: true,
    acceptsEntries: false,
    balance: 45000.00
  }
]

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccountType, setSelectedAccountType] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2']))
  const { toast } = useToast()

  const [newAccount, setNewAccount] = useState({
    code: '',
    name: '',
    accountTypeId: '',
    parentId: '',
    acceptsEntries: true,
    description: ''
  })

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const handleCreateAccount = async () => {
    try {
      // Aquí iría la llamada tRPC
      toast({
        title: "Cuenta creada",
        description: "La cuenta ha sido creada exitosamente."
      })
      setIsCreateDialogOpen(false)
      setNewAccount({
        code: '',
        name: '',
        accountTypeId: '',
        parentId: '',
        acceptsEntries: true,
        description: ''
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la cuenta."
      })
    }
  }

  const renderAccountRow = (account: any, level = 0) => {
    const hasChildren = account.children && account.children.length > 0
    const isExpanded = expandedNodes.has(account.id)
    const paddingLeft = level * 24

    return (
      <>
        <TableRow key={account.id} className="hover:bg-gray-50">
          <TableCell className="font-medium">
            <div className="flex items-center" style={{ paddingLeft: `${paddingLeft}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-2"
                  onClick={() => toggleNode(account.id)}
                >
                  {isExpanded ? (
                    <FolderOpen className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </Button>
              )}
              <span className="font-mono text-sm">{account.code}</span>
            </div>
          </TableCell>
          <TableCell>
            <div style={{ paddingLeft: hasChildren ? '0px' : '28px' }}>
              {account.name}
            </div>
          </TableCell>
          <TableCell>
            {account.accountType && (
              <Badge variant={account.accountType.nature === 'DEBIT' ? 'default' : 'secondary'}>
                {account.accountType.name}
              </Badge>
            )}
          </TableCell>
          <TableCell className="text-right">
            {account.balance !== undefined && (
              <span className="font-mono">
                Bs. {account.balance.toLocaleString('es-VE', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
            )}
          </TableCell>
          <TableCell>
            <Badge variant={account.isActive ? 'default' : 'secondary'}>
              {account.isActive ? 'Activa' : 'Inactiva'}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={account.acceptsEntries ? 'default' : 'outline'}>
              {account.acceptsEntries ? 'Sí' : 'No'}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              {account.acceptsEntries && (
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && 
          account.children.map((child: any) => renderAccountRow(child, level + 1))
        }
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plan de Cuentas</h1>
          <p className="text-muted-foreground">
            Gestiona la estructura contable de tu empresa
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cuenta</DialogTitle>
              <DialogDescription>
                Agrega una nueva cuenta al plan de cuentas
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    placeholder="1.1.01.001"
                    value={newAccount.code}
                    onChange={(e) => setNewAccount({...newAccount, code: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Tipo de Cuenta</Label>
                  <Select
                    value={newAccount.accountTypeId}
                    onValueChange={(value) => setNewAccount({...newAccount, accountTypeId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activo</SelectItem>
                      <SelectItem value="2">Pasivo</SelectItem>
                      <SelectItem value="3">Patrimonio</SelectItem>
                      <SelectItem value="4">Ingresos</SelectItem>
                      <SelectItem value="5">Gastos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Cuenta</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la cuenta"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Cuenta Padre (Opcional)</Label>
                <Select
                  value={newAccount.parentId}
                  onValueChange={(value) => setNewAccount({...newAccount, parentId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cuenta padre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - ACTIVO</SelectItem>
                    <SelectItem value="2">1.1 - ACTIVO CORRIENTE</SelectItem>
                    <SelectItem value="3">1.1.01 - EFECTIVO Y EQUIVALENTES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción de la cuenta"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="acceptsEntries"
                  checked={newAccount.acceptsEntries}
                  onChange={(e) => setNewAccount({...newAccount, acceptsEntries: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="acceptsEntries">Acepta movimientos contables</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAccount} className="flex-1">
                  Crear Cuenta
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra las cuentas por código, nombre o tipo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por código o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedAccountType} onValueChange={setSelectedAccountType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de cuenta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                <SelectItem value="1">Activo</SelectItem>
                <SelectItem value="2">Pasivo</SelectItem>
                <SelectItem value="3">Patrimonio</SelectItem>
                <SelectItem value="4">Ingresos</SelectItem>
                <SelectItem value="5">Gastos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla del Plan de Cuentas */}
      <Card>
        <CardHeader>
          <CardTitle>Plan de Cuentas</CardTitle>
          <CardDescription>
            Estructura jerárquica de las cuentas contables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Movimientos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAccounts.map((account) => renderAccountRow(account))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cuentas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +12 nuevas este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuentas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              94.7% del total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              63.2% del total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. 125,000.50</div>
            <p className="text-xs text-muted-foreground">
              Balance general
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}