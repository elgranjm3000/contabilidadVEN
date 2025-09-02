import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Calculator, FileText, TrendingUp, DollarSign, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleDateString('es-VE')}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingresos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. 45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asientos Contables
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reportes Generados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +19% respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 desde la hora anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Resumen Financiero */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
            <CardDescription>
              Estado financiero actual de la empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Activo Corriente</span>
                <span className="text-sm text-green-600">Bs. 125,430.50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pasivo Corriente</span>
                <span className="text-sm text-red-600">Bs. 45,230.80</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Patrimonio</span>
                <span className="text-sm text-blue-600">Bs. 80,199.70</span>
              </div>
              <hr />
              <div className="flex items-center justify-between font-semibold">
                <span>Balance Total</span>
                <span className="text-green-600">Bs. 125,430.50</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas transacciones realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Asiento AS-000001</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
                <div className="text-sm text-green-600">+Bs. 1,250.00</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Factura FV-000012</p>
                  <p className="text-xs text-gray-500">Hace 4 horas</p>
                </div>
                <div className="text-sm text-blue-600">+Bs. 3,400.00</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Pago a Proveedor</p>
                  <p className="text-xs text-gray-500">Hace 6 horas</p>
                </div>
                <div className="text-sm text-red-600">-Bs. 850.00</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Reporte Balance</p>
                  <p className="text-xs text-gray-500">Ayer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Recordatorios */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Cumplimiento Fiscal
            </CardTitle>
            <CardDescription>
              Estado de declaraciones y reportes SENIAT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Declaración IVA Noviembre</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Completado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Libro de Compras</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Pendiente
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ISLR Trimestral</span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Vencido
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>
              Funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-left border rounded-md hover:bg-gray-50 transition-colors">
                <Calculator className="h-5 w-5 mb-2 text-blue-600" />
                <div className="text-sm font-medium">Nuevo Asiento</div>
              </button>
              <button className="p-3 text-left border rounded-md hover:bg-gray-50 transition-colors">
                <FileText className="h-5 w-5 mb-2 text-green-600" />
                <div className="text-sm font-medium">Ver Reportes</div>
              </button>
              <button className="p-3 text-left border rounded-md hover:bg-gray-50 transition-colors">
                <Building2 className="h-5 w-5 mb-2 text-purple-600" />
                <div className="text-sm font-medium">Nueva Factura</div>
              </button>
              <button className="p-3 text-left border rounded-md hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-5 w-5 mb-2 text-orange-600" />
                <div className="text-sm font-medium">Empresas</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}