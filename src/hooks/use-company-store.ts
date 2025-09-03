import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Company {
  id: string
  businessName: string
  rif: string
  role: string
}

interface CompanyStore {
  selectedCompany: Company | null
  companies: Company[]
  setSelectedCompany: (company: Company | null) => void
  setCompanies: (companies: Company[]) => void
  clearCompanies: () => void
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      selectedCompany: null,
      companies: [],
      setSelectedCompany: (company) => set({ selectedCompany: company }),
      setCompanies: (companies) => set({ companies }),
      clearCompanies: () => set({ companies: [], selectedCompany: null }),
    }),
    {
      name: 'company-storage',
    }
  )
)
