// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { VENEZUELA_CONSTANTS } from '../src/app/lib/constants/venezuela'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando base de datos MySQL...')

  // 1. Crear tipos de cuenta
  console.log('📊 Creando tipos de cuenta...')
  for (const accountType of VENEZUELA_CONSTANTS.ACCOUNT_TYPES) {
    await prisma.accountType.upsert({
      where: { id: accountType.id },
      update: {},
      create: {
        id: accountType.id,
        code: accountType.code,
        name: accountType.name,
        nature: accountType.nature as any
      }
    })
  }

  // 2. Crear usuario administrador
  console.log('👤 Creando usuario administrador...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      firstName: 'Administrador',
      lastName: 'Sistema',
      role: 'ADMIN'
    }
  })

  // 3. Crear empresa demo
  console.log('🏢 Creando empresa demo...')
  const demoCompany = await prisma.company.upsert({
    where: { rif: 'J-12345678-9' },
    update: {},
    create: {
      rif: 'J-12345678-9',
      businessName: 'Empresa Demo C.A.',
      commercialName: 'Demo Corp',
      address: 'Av. Principal, Centro, Caracas 1010',
      phone: '0212-1234567',
      email: 'info@democorp.com.ve',
      economicActivity: '621000'
    }
  })

  // 4. Asociar usuario con empresa
  await prisma.companyUser.upsert({
    where: {
      unique_company_user: {
        companyId: demoCompany.id,
        userId: adminUser.id
      }
    },
    update: {},
    create: {
      companyId: demoCompany.id,
      userId: adminUser.id,
      role: 'ADMIN',
      permissions: {
        accounts: ['read', 'write', 'delete'],
        journal: ['read', 'write', 'approve'],
        invoices: ['read', 'write', 'delete'],
        reports: ['read', 'export']
      }
    }
  })

  // 5. Crear plan de cuentas demo
  console.log('📋 Creando plan de cuentas demo...')
  const accounts = []
  
  for (const account of VENEZUELA_CONSTANTS.DEFAULT_CHART_OF_ACCOUNTS) {
    const parts = account.code.split('.')
    const level = parts.length
    const accountTypeId = parseInt(parts[0])
    
    // Buscar cuenta padre
    let parentId = null
    if (level > 1) {
      const parentCode = parts.slice(0, -1).join('.')
      const parentAccount = accounts.find(a => a.code === parentCode)
      parentId = parentAccount?.id || null
    }

    const createdAccount = await prisma.account.create({
      data: {
        companyId: demoCompany.id,
        code: account.code,
        name: account.name,
        accountTypeId,
        parentId,
        level,
        isActive: true,
        acceptsEntries: level >= 3 // Solo las cuentas de mayor nivel aceptan movimientos
      }
    })
    
    accounts.push(createdAccount)
  }

  // 6. Crear centro de costo demo
  console.log('🎯 Creando centros de costo...')
  await prisma.costCenter.create({
    data: {
      companyId: demoCompany.id,
      code: 'ADM',
      name: 'Administración General',
      description: 'Centro de costo para gastos administrativos',
      isActive: true
    }
  })

  await prisma.costCenter.create({
    data: {
      companyId: demoCompany.id,
      code: 'VEN',
      name: 'Departamento de Ventas',
      description: 'Centro de costo para actividades de ventas',
      isActive: true
    }
  })

  // 7. Crear período contable actual
  console.log('📅 Creando período contable...')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  await prisma.accountingPeriod.create({
    data: {
      companyId: demoCompany.id,
      year: currentYear,
      month: currentMonth,
      startDate: new Date(currentYear, currentMonth - 1, 1),
      endDate: new Date(currentYear, currentMonth, 0),
      status: 'OPEN'
    }
  })

  console.log('✅ Base de datos MySQL sembrada correctamente!')
  console.log('📧 Email: admin@example.com')
  console.log('🔑 Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error sembrando base de datos MySQL:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })