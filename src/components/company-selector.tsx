// src/components/company-selector.tsx
'use client'

import { useState } from 'react'
import { Check, ChevronDown, Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Company {
  id: string
  rif: string
  businessName: string
  commercialName?: string | null
}

// Mock data - en la implementación real vendría de tRPC
const mockCompanies: Company[] = [
  {
    id: '1',
    rif: 'J-12345678-9',
    businessName: 'Empresa Demo C.A.',
    commercialName: 'Demo Corp'
  },
  {
    id: '2',
    rif: 'J-98765432-1',
    businessName: 'Consultora ABC S.R.L.',
    commercialName: 'ABC Consultoría'
  },
  {
    id: '3',
    rif: 'J-11223344-5',
    businessName: 'Servicios Integrales XYZ C.A.',
    commercialName: null
  }
]

interface CompanySelectorProps {
  selectedCompanyId?: string
  onCompanyChange?: (companyId: string) => void
  className?: string
}

export function CompanySelector({
  selectedCompanyId,
  onCompanyChange,
  className
}: CompanySelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedCompany = mockCompanies.find(
    company => company.id === selectedCompanyId
  )

  const handleSelect = (companyId: string) => {
    onCompanyChange?.(companyId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            className
          )}
        >
          {selectedCompany ? (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {selectedCompany.commercialName || selectedCompany.businessName}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {selectedCompany.rif}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Seleccionar empresa...</span>
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput placeholder="Buscar empresa..." />
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No se encontraron empresas</p>
              <Button size="sm" variant="outline" className="mt-2">
                <Plus className="h-4 w-4 mr-1" />
                Crear nueva empresa
              </Button>
            </div>
          </CommandEmpty>
          <CommandGroup>
            {mockCompanies.map((company) => (
              <CommandItem
                key={company.id}
                onSelect={() => handleSelect(company.id)}
                className="flex items-center gap-2 p-2"
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    selectedCompanyId === company.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium">
                    {company.commercialName || company.businessName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {company.rif}
                  </span>
                  {company.commercialName && (
                    <span className="text-xs text-muted-foreground">
                      {company.businessName}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="border-t p-2">
            <Button size="sm" variant="ghost" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Agregar nueva empresa
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}