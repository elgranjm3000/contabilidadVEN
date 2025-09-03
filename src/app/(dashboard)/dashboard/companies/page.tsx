// src/app/(dashboard)/dashboard/companies/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Building2, 
  Users, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data
const mockCompanies = [
  {
    id: '1',
    rif: 'J-12345678-9',
    businessName: 'Empresa Demo C.A.',
    commercialName: 'Demo Corp',
    address: 'Av. Principal, Centro, Caracas 1010',
    phone: '0212-1234567',
    email: 'info@democorp.com.ve',
    economicActivity: '621000',
    createdAt: '2024-01-15',
    isActive: true,
    userCount: 3,
    lastActivity: '2024-12-02'
  },
  {
    id: '2',
    rif: 'J-98765432-1',
    businessName: 'Consultora ABC S.R.L.',
    commercialName: 'ABC Consultoría',
    address: 'Centro Empresarial, Las Mercedes, Caracas',
    phone: '0212-9876543',
    email: 'contacto@abcconsultoria.com',
    economicActivity: '702100',
    createdAt: '2024-02-20',
    isActive: true,
    userCount: 2,
    lastActivity: '2024-12-01'
  },
  {
    id: '3',
    rif: 'J-11223344-5',
    businessName: 'Servicios Integrales XYZ C.A.',
    commercialName: null,
    address: 'Zona Industrial, Valencia, Carabobo',
    phone: '0241-1122334',
    email: 'admin@serviciosxyz.com',
    economicActivity: '811000',
    createdAt: '2024-03-10',
    isActive: false,
    userCount: 1,
    lastActivity: '2024-11-15'
  }
]

const economicActivities = [
  { code: '621000', name: 'Actividades de programación informática' },
  { code: '702100', name: 'Actividades de consultoría de gestión empresarial' },
  { code: '811000', name: 'Servicios combinados de apoyo a instalaciones' },
  { code: '461000', name: 'Venta al por mayor a cambio de una retribución' },
  { code: '471100', name: 'Venta al por menor en comercios no especializados' }
]

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const { toast } = useToast()

  const [newCompany, setNewCompany] = useState({
    rif: '',
    businessName: '',
    commercialName: '',
    address: '',
    phone: '',
    email: '',
    economicActivity: ''
  })

  const filteredCompanies = mockCompanies.filter(company => 
    company.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.commercialName && company.commercialName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateCompany = async () => {
    try {
      // Aquí iría la llamada tRPC
      toast({
        title: "Empresa creada",
        description: "La empresa ha sido creada exitosamente."
      })
      setIsCreateDialogOpen(false)
      setNewCompany({
        rif: '',
        businessName: '',
        commercialName: '',
        address: '',
        phone: '',
        email: '',
        economicActivity: ''
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la empresa."
      })
    }
  }

  const getEconomicActivityName = (code: string) => {
    const activity = economicActivities.find(act => act.code === code)
    return activity ? activity.name : code
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gestiona las empresas del sistema contable
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Empresa</DialogTitle>
              <DialogDescription>
                Registra una nueva empresa en el sistema
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h4 className="font-medium">Información Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rif">RIF *</Label>
                    <Input
                      id="rif"
                      placeholder="J-12345678-9"
                      value={newCompany.rif}
                      onChange={(e) => setNewCompany({...newCompany, rif: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="economicActivity">Actividad Económica</Label>
                    <Select
                      value={newCompany.economicActivity}
                      onValueChange={(value) => setNewCompany({...newCompany, economicActivity: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        {economicActivities.map((activity) => (
                          <SelectItem key={activity.code} value={activity.code}>
                            {activity.code} - {activity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Razón Social *</Label>
                  <Input
                    id="businessName"
                    placeholder="Empresa Demo C.A."
                    value={newCompany.businessName}
                    onChange={(e) => setNewCompany({...newCompany, businessName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commercialName">Nombre Comercial</Label>
                  <Input
                    id="commercialName"
                    placeholder="Demo Corp"
                    value={newCompany.commercialName}
                    onChange={(e) => setNewCompany({...newCompany, commercialName: e.target.value})}
                  />
                </div>
              </div>

              {/* Información de contacto */}
              <div className="space-y-4">
                <h4 className="font-medium">Información de Contacto</h4>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    placeholder="Dirección completa de la empresa"
                    value={newCompany.address}
                    onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      placeholder="0212-1234567"
                      value={newCompany.phone}
                      onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@empresa.com"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateCompany} className="flex-1">
                  Crear Empresa
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
            Busca empresas por RIF, razón social o nombre comercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>
            {filteredCompanies.length} empresa{filteredCompanies.length !== 1 ? 's' : ''} encontrada{filteredCompanies.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>RIF</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Actividad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {company.commercialName || company.businessName}
                        </div>
                        {company.commercialName && (
                          <div className="text-sm text-muted-foreground">
                            {company.businessName}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {company.rif}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {company.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {company.phone}
                        </div>
                      )}
                      {company.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {company.email}
                        </div>
                      )}
                      {company.address && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {company.address.substring(0, 30)}...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-mono">{company.economicActivity}</div>
                      <div className="text-muted-foreground text-xs">
                        {getEconomicActivityName(company.economicActivity)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.isActive ? 'default' : 'secondary'}>
                      {company.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{company.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedCompany(company)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
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
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompanies.length}</div>
            <p className="text-xs text-muted-foreground">
              En el sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockCompanies.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockCompanies.filter(c => c.isActive).length / mockCompanies.length) * 100)}% del total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCompanies.reduce((sum, c) => sum + c.userCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevas Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              +33% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalles */}
      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {selectedCompany.commercialName || selectedCompany.businessName}
              </DialogTitle>
              <DialogDescription>
                Información detallada de la empresa
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Información Legal</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>RIF:</span>
                      <span className="font-mono">{selectedCompany.rif}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Razón Social:</span>
                      <span>{selectedCompany.businessName}</span>
                    </div>
                    {selectedCompany.commercialName && (
                      <div className="flex justify-between">
                        <span>Nombre Comercial:</span>
                        <span>{selectedCompany.commercialName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Actividad Económica:</span>
                      <div className="text-right">
                        <div className="font-mono">{selectedCompany.economicActivity}</div>
                        <div className="text-xs text-muted-foreground">
                          {getEconomicActivityName(selectedCompany.economicActivity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Contacto y Ubicación</h4>
                  <div className="space-y-2 text-sm">
                    {selectedCompany.address && (
                      <div>
                        <div className="flex items-center gap-1 font-medium">
                          <MapPin className="h-3 w-3" />
                          Dirección:
                        </div>
                        <div className="text-muted-foreground ml-4">
                          {selectedCompany.address}
                        </div>
                      </div>
                    )}
                    {selectedCompany.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{selectedCompany.phone}</span>
                      </div>
                    )}
                    {selectedCompany.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{selectedCompany.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Estadísticas</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{selectedCompany.userCount}</div>
                    <div className="text-xs text-muted-foreground">Usuarios</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {selectedCompany.isActive ? (
                        <Badge variant="default">Activa</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Estado</div>
                  </div>
                  <div>
                    <div className="text-sm font-mono">
                      {new Date(selectedCompany.lastActivity).toLocaleDateString('es-VE')}
                    </div>
                    <div className="text-xs text-muted-foreground">Última actividad</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}