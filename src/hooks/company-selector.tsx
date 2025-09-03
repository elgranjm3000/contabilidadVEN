'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, ChevronDown } from 'lucide-react'
import { useCompanyStore } from '@/hooks/use-company-store'

export function CompanySelector() {
  const { selectedCompany, companies, setSelectedCompany } = useCompanyStore()

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find(c => c.id === companyId)
    if (company) {
      setSelectedCompany(company)
    }
  }

  if (companies.length === 0) {
    return null
  }

  if (companies.length === 1) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>{companies[0].businessName}</span>
      </div>
    )
  }

  return (
    <Select
      value={selectedCompany?.id || ''}
      onValueChange={handleCompanyChange}
    >
      <SelectTrigger className="w-64">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <SelectValue placeholder="Seleccionar empresa" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            <div className="flex flex-col">
              <span className="font-medium">{company.businessName}</span>
              <span className="text-xs text-muted-foreground">{company.rif}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}