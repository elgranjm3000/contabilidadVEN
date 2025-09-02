import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, FileText, Building2, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Contabilidad Venezuela
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Solución completa para contabilidad empresarial cumpliendo normativas VEN-NIF y SENIAT
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Comenzar Gratis
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>

      {/* Características */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Building2 className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle>Multi-Empresa</CardTitle>
            <CardDescription>
              Gestiona múltiples empresas desde una sola cuenta
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Calculator className="h-12 w-12 text-green-600 mb-4" />
            <CardTitle>Plan de Cuentas VEN-NIF</CardTitle>
            <CardDescription>
              Plan de cuentas preconfigurado según normativas venezolanas
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-12 w-12 text-purple-600 mb-4" />
            <CardTitle>Reportes SENIAT</CardTitle>
            <CardDescription>
              Genera reportes automáticos para declaraciones fiscales
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-12 w-12 text-orange-600 mb-4" />
            <CardTitle>Multi-Usuario</CardTitle>
            <CardDescription>
              Control de acceso por roles: Admin, Contador, Auditor
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600">
        <p>&copy; 2024 Sistema Contabilidad Venezuela. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}