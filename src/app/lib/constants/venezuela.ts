// src/lib/constants/venezuela.ts
export const VENEZUELA_CONSTANTS = {
  CURRENCY: {
    CODE: 'VES',
    SYMBOL: 'Bs.',
    NAME: 'Bolívar Soberano'
  },
  
  TAX_RATES: {
    IVA: {
      GENERAL: 16,
      REDUCED: 8,
      EXEMPT: 0
    },
    ISLR: {
      COMPANIES: 34,
      INDIVIDUALS: 6
    }
  },
  
  RIF_TYPES: [
    { code: 'J', name: 'Jurídico (Empresas)' },
    { code: 'G', name: 'Gubernamental' },
    { code: 'V', name: 'Venezolano (Persona Natural)' },
    { code: 'E', name: 'Extranjero' },
    { code: 'P', name: 'Pasaporte' }
  ],
  
  ACCOUNT_TYPES: [
    { id: 1, code: '1', name: 'ACTIVO', nature: 'DEBIT' },
    { id: 2, code: '2', name: 'PASIVO', nature: 'CREDIT' },
    { id: 3, code: '3', name: 'PATRIMONIO', nature: 'CREDIT' },
    { id: 4, code: '4', name: 'INGRESOS', nature: 'CREDIT' },
    { id: 5, code: '5', name: 'GASTOS', nature: 'DEBIT' }
  ],
  
  DEFAULT_CHART_OF_ACCOUNTS: [
    // ACTIVOS (1)
    { code: '1', name: 'ACTIVO', level: 1, accountTypeId: 1, acceptsEntries: false },
    { code: '1.1', name: 'ACTIVO CORRIENTE', level: 2, accountTypeId: 1, acceptsEntries: false },
    { code: '1.1.01', name: 'EFECTIVO Y EQUIVALENTES', level: 3, accountTypeId: 1, acceptsEntries: false },
    { code: '1.1.01.001', name: 'Caja', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.1.01.002', name: 'Banco Cuenta Corriente', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.1.01.003', name: 'Banco Cuenta Ahorros', level: 4, accountTypeId: 1, acceptsEntries: true },
    
    { code: '1.1.02', name: 'CUENTAS POR COBRAR', level: 3, accountTypeId: 1, acceptsEntries: false },
    { code: '1.1.02.001', name: 'Clientes', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.1.02.002', name: 'Cuentas por Cobrar Empleados', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.1.02.003', name: 'Anticipo a Proveedores', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.1.02.004', name: 'IVA Crédito Fiscal', level: 4, accountTypeId: 1, acceptsEntries: true },
    
    { code: '1.1.03', name: 'INVENTARIOS', level: 3, accountTypeId: 1, acceptsEntries: false },
    { code: '1.1.03.001', name: 'Inventario de Mercancías', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.1.03.002', name: 'Inventario de Materiales', level: 4, accountTypeId: 1, acceptsEntries: true },
    
    { code: '1.2', name: 'ACTIVO NO CORRIENTE', level: 2, accountTypeId: 1, acceptsEntries: false },
    { code: '1.2.01', name: 'PROPIEDADES, PLANTA Y EQUIPO', level: 3, accountTypeId: 1, acceptsEntries: false },
    { code: '1.2.01.001', name: 'Edificios', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.2.01.002', name: 'Mobiliario y Equipo de Oficina', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.2.01.003', name: 'Equipos de Computación', level: 4, accountTypeId: 1, acceptsEntries: true },
    { code: '1.2.01.004', name: 'Vehículos', level: 4, accountTypeId: 1, acceptsEntries: true },
    
    // PASIVOS (2)
    { code: '2', name: 'PASIVO', level: 1, accountTypeId: 2, acceptsEntries: false },
    { code: '2.1', name: 'PASIVO CORRIENTE', level: 2, accountTypeId: 2, acceptsEntries: false },
    { code: '2.1.01', name: 'CUENTAS POR PAGAR', level: 3, accountTypeId: 2, acceptsEntries: false },
    { code: '2.1.01.001', name: 'Proveedores', level: 4, accountTypeId: 2, acceptsEntries: true },
    { code: '2.1.01.002', name: 'Acreedores', level: 4, accountTypeId: 2, acceptsEntries: true },
    { code: '2.1.01.003', name: 'IVA Débito Fiscal', level: 4, accountTypeId: 2, acceptsEntries: true },
    
    { code: '2.1.02', name: 'RETENCIONES POR PAGAR', level: 3, accountTypeId: 2, acceptsEntries: false },
    { code: '2.1.02.001', name: 'Retención IVA por Pagar', level: 4, accountTypeId: 2, acceptsEntries: true },
    { code: '2.1.02.002', name: 'Retención ISLR por Pagar', level: 4, accountTypeId: 2, acceptsEntries: true },
    { code: '2.1.02.003', name: 'Retención Municipal por Pagar', level: 4, accountTypeId: 2, acceptsEntries: true },
    
    { code: '2.1.03', name: 'OBLIGACIONES LABORALES', level: 3, accountTypeId: 2, acceptsEntries: false },
    { code: '2.1.03.001', name: 'Sueldos por Pagar', level: 4, accountTypeId: 2, acceptsEntries: true },
    { code: '2.1.03.002', name: 'Prestaciones Sociales por Pagar', level: 4, accountTypeId: 2, acceptsEntries: true },
    { code: '2.1.03.003', name: 'Vacaciones por Pagar', level: 4, accountTypeId: 2, acceptsEntries: true },
    
    { code: '2.2', name: 'PASIVO NO CORRIENTE', level: 2, accountTypeId: 2, acceptsEntries: false },
    { code: '2.2.01', name: 'PRÉSTAMOS A LARGO PLAZO', level: 3, accountTypeId: 2, acceptsEntries: false },
    { code: '2.2.01.001', name: 'Préstamos Bancarios', level: 4, accountTypeId: 2, acceptsEntries: true },
    
    // PATRIMONIO (3)
    { code: '3', name: 'PATRIMONIO', level: 1, accountTypeId: 3, acceptsEntries: false },
    { code: '3.1', name: 'CAPITAL', level: 2, accountTypeId: 3, acceptsEntries: false },
    { code: '3.1.01', name: 'CAPITAL SOCIAL', level: 3, accountTypeId: 3, acceptsEntries: false },
    { code: '3.1.01.001', name: 'Capital Suscrito y Pagado', level: 4, accountTypeId: 3, acceptsEntries: true },
    
    { code: '3.2', name: 'RESULTADOS', level: 2, accountTypeId: 3, acceptsEntries: false },
    { code: '3.2.01', name: 'RESULTADOS ACUMULADOS', level: 3, accountTypeId: 3, acceptsEntries: false },
    { code: '3.2.01.001', name: 'Resultados Acumulados', level: 4, accountTypeId: 3, acceptsEntries: true },
    { code: '3.2.01.002', name: 'Resultado del Ejercicio', level: 4, accountTypeId: 3, acceptsEntries: true },
    
    // INGRESOS (4)
    { code: '4', name: 'INGRESOS', level: 1, accountTypeId: 4, acceptsEntries: false },
    { code: '4.1', name: 'INGRESOS OPERACIONALES', level: 2, accountTypeId: 4, acceptsEntries: false },
    { code: '4.1.01', name: 'VENTAS', level: 3, accountTypeId: 4, acceptsEntries: false },
    { code: '4.1.01.001', name: 'Ventas de Mercancías', level: 4, accountTypeId: 4, acceptsEntries: true },
    { code: '4.1.01.002', name: 'Ventas de Servicios', level: 4, accountTypeId: 4, acceptsEntries: true },
    
    { code: '4.2', name: 'OTROS INGRESOS', level: 2, accountTypeId: 4, acceptsEntries: false },
    { code: '4.2.01', name: 'INGRESOS FINANCIEROS', level: 3, accountTypeId: 4, acceptsEntries: false },
    { code: '4.2.01.001', name: 'Ingresos por Intereses', level: 4, accountTypeId: 4, acceptsEntries: true },
    { code: '4.2.01.002', name: 'Diferencia en Cambio Positiva', level: 4, accountTypeId: 4, acceptsEntries: true },
    
    // GASTOS (5)
    { code: '5', name: 'GASTOS', level: 1, accountTypeId: 5, acceptsEntries: false },
    { code: '5.1', name: 'COSTO DE VENTAS', level: 2, accountTypeId: 5, acceptsEntries: false },
    { code: '5.1.01', name: 'COSTO DE MERCANCÍAS VENDIDAS', level: 3, accountTypeId: 5, acceptsEntries: false },
    { code: '5.1.01.001', name: 'Costo de Mercancías Vendidas', level: 4, accountTypeId: 5, acceptsEntries: true },
    
    { code: '5.2', name: 'GASTOS OPERACIONALES', level: 2, accountTypeId: 5, acceptsEntries: false },
    { code: '5.2.01', name: 'GASTOS ADMINISTRATIVOS', level: 3, accountTypeId: 5, acceptsEntries: false },
    { code: '5.2.01.001', name: 'Sueldos y Salarios', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.01.002', name: 'Prestaciones Sociales', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.01.003', name: 'Alquiler', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.01.004', name: 'Servicios Públicos', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.01.005', name: 'Telecomunicaciones', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.01.006', name: 'Papelería y Útiles de Oficina', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.01.007', name: 'Mantenimiento y Reparaciones', level: 4, accountTypeId: 5, acceptsEntries: true },
    
    { code: '5.2.02', name: 'GASTOS DE VENTAS', level: 3, accountTypeId: 5, acceptsEntries: false },
    { code: '5.2.02.001', name: 'Publicidad y Promoción', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.02.002', name: 'Comisiones de Ventas', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.2.02.003', name: 'Transporte y Fletes', level: 4, accountTypeId: 5, acceptsEntries: true },
    
    { code: '5.3', name: 'GASTOS FINANCIEROS', level: 2, accountTypeId: 5, acceptsEntries: false },
    { code: '5.3.01', name: 'GASTOS BANCARIOS', level: 3, accountTypeId: 5, acceptsEntries: false },
    { code: '5.3.01.001', name: 'Intereses y Comisiones Bancarias', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.3.01.002', name: 'Diferencia en Cambio Negativa', level: 4, accountTypeId: 5, acceptsEntries: true },
    
    { code: '5.4', name: 'OTROS GASTOS', level: 2, accountTypeId: 5, acceptsEntries: false },
    { code: '5.4.01', name: 'GASTOS EXTRAORDINARIOS', level: 3, accountTypeId: 5, acceptsEntries: false },
    { code: '5.4.01.001', name: 'Pérdidas Extraordinarias', level: 4, accountTypeId: 5, acceptsEntries: true },
    { code: '5.4.01.002', name: 'Impuesto Sobre la Renta', level: 4, accountTypeId: 5, acceptsEntries: true }
  ],
  
  VENEZUELAN_STATES: [
    { code: 'DC', name: 'Distrito Capital' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'AN', name: 'Anzoátegui' },
    { code: 'AP', name: 'Apure' },
    { code: 'AR', name: 'Aragua' },
    { code: 'BA', name: 'Barinas' },
    { code: 'BO', name: 'Bolívar' },
    { code: 'CA', name: 'Carabobo' },
    { code: 'CO', name: 'Cojedes' },
    { code: 'DA', name: 'Delta Amacuro' },
    { code: 'FA', name: 'Falcón' },
    { code: 'GU', name: 'Guárico' },
    { code: 'LA', name: 'Lara' },
    { code: 'ME', name: 'Mérida' },
    { code: 'MI', name: 'Miranda' },
    { code: 'MO', name: 'Monagas' },
    { code: 'NE', name: 'Nueva Esparta' },
    { code: 'PO', name: 'Portuguesa' },
    { code: 'SU', name: 'Sucre' },
    { code: 'TA', name: 'Táchira' },
    { code: 'TR', name: 'Trujillo' },
    { code: 'VA', name: 'Vargas' },
    { code: 'YA', name: 'Yaracuy' },
    { code: 'ZU', name: 'Zulia' }
  ],
  
  PHONE_PREFIXES: [
    '0212', // Caracas
    '0213', // Caracas
    '0214', // Caracas
    '0241', // Valencia
    '0243', // Maracay
    '0244', // Maracay
    '0245', // San Juan de los Morros
    '0246', // La Victoria
    '0247', // San Sebastián
    '0248', // Zaraza
    '0249', // San Fernando de Apure
    '0251', // Punto Fijo
    '0252', // Punto Fijo
    '0253', // Acarigua
    '0254', // Barquisimeto
    '0255', // Carora
    '0256', // San Carlos
    '0257', // Guanare
    '0258', // Acarigua
    '0259', // Barinas
    '0261', // Maracaibo
    '0262', // Cabimas
    '0263', // San Cristóbal
    '0264', // Machiques
    '0265', // Santa Bárbara del Zulia
    '0266', // Bachaquero
    '0267', // Ciudad Ojeda
    '0268', // Maracaibo
    '0269', // Coro
    '0271', // Las Mercedes
    '0272', // Valera
    '0273', // Boconó
    '0274', // Mérida
    '0275', // El Vigía
    '0276', // Tovar
    '0277', // Santa Elena de Uairén
    '0278', // Elorza
    '0279', // Achaguas
    '0281', // Barcelona
    '0282', // El Tigre
    '0283', // Puerto La Cruz
    '0284', // San José de Guanipa
    '0285', // Anaco
    '0286', // Cantaura
    '0287', // Pariaguan
    '0288', // Santa Ana
    '0289', // Soledad
    '0291', // Cumaná
    '0292', // Carúpano
    '0293', // Río Caribe
    '0294', // Güiria
    // Móviles
    '0412', // Digitel
    '0414', // Digitel/Movistar
    '0416', // Movistar
    '0424', // Digitel/Movistar
    '0426'  // Movistar
  ],
  
  ECONOMIC_ACTIVITIES: [
    { code: '011', name: 'Cultivo de cereales' },
    { code: '012', name: 'Cultivo de hortalizas' },
    { code: '013', name: 'Cultivo de frutas' },
    { code: '621', name: 'Actividades de programación informática' },
    { code: '622', name: 'Consultoría de informática' },
    { code: '631', name: 'Procesamiento de datos y hospedaje' },
    { code: '641', name: 'Intermediación monetaria' },
    { code: '642', name: 'Actividades de sociedades de cartera' },
    { code: '691', name: 'Actividades jurídicas' },
    { code: '692', name: 'Actividades de contabilidad' },
    { code: '711', name: 'Actividades de arquitectura e ingeniería' },
    { code: '721', name: 'Investigación y desarrollo' },
    { code: '731', name: 'Publicidad' },
    { code: '741', name: 'Actividades de diseño especializado' },
    { code: '801', name: 'Actividades de seguridad privada' },
    { code: '811', name: 'Actividades combinadas de apoyo a instalaciones' },
    { code: '821', name: 'Actividades de administración y apoyo de oficina' },
    { code: '851', name: 'Enseñanza preescolar y primaria' },
    { code: '852', name: 'Enseñanza secundaria' },
    { code: '853', name: 'Enseñanza superior' },
    { code: '861', name: 'Actividades de hospitales' },
    { code: '862', name: 'Actividades de médicos y odontólogos' },
    { code: '869', name: 'Otras actividades de atención de la salud humana' }
  ],
  
  DEFAULT_COST_CENTERS: [
    { code: 'ADM', name: 'Administración General', description: 'Centro de costo para gastos administrativos generales' },
    { code: 'VEN', name: 'Departamento de Ventas', description: 'Centro de costo para actividades de ventas y marketing' },
    { code: 'PRO', name: 'Producción', description: 'Centro de costo para actividades de producción' },
    { code: 'COM', name: 'Compras', description: 'Centro de costo para actividades de compras y adquisiciones' },
    { code: 'FIN', name: 'Finanzas', description: 'Centro de costo para actividades financieras' },
    { code: 'RRH', name: 'Recursos Humanos', description: 'Centro de costo para gestión de personal' },
    { code: 'TEC', name: 'Tecnología', description: 'Centro de costo para sistemas y tecnología' }
  ],
  
  SENIAT_FORMATS: {
    IVA: {
      BOOK_PURCHASES: 'Libro de Compras IVA',
      BOOK_SALES: 'Libro de Ventas IVA',
      FORM_30: 'Formulario 30 - Declaración IVA'
    },
    ISLR: {
      FORM_ARC: 'Formulario ARC - Agente de Retención',
      FORM_ARP: 'Formulario ARP - Agente de Percepción'
    }
  }
} as const

// Tipos TypeScript para mejor tipado
export type RIFType = typeof VENEZUELA_CONSTANTS.RIF_TYPES[number]['code']
export type AccountNature = typeof VENEZUELA_CONSTANTS.ACCOUNT_TYPES[number]['nature']
export type VenezuelanState = typeof VENEZUELA_CONSTANTS.VENEZUELAN_STATES[number]['code']
export type PhonePrefix = typeof VENEZUELA_CONSTANTS.PHONE_PREFIXES[number]

// Utilidades helper
export const VENEZUELA_UTILS = {
  validateRIF: (rif: string): boolean => {
    const rifPattern = /^[JGVPE]-\d{8}-\d$/
    return rifPattern.test(rif)
  },
  
  formatRIF: (rif: string): string => {
    const clean = rif.replace(/[^JGVPE0-9]/g, '')
    if (clean.length === 10) {
      return `${clean[0]}-${clean.slice(1, 9)}-${clean[9]}`
    }
    return rif
  },
  
  validatePhone: (phone: string): boolean => {
    const phonePattern = /^(0212|0213|0214|0241|0243|0244|0245|0246|0247|0248|0249|0251|0252|0253|0254|0255|0256|0257|0258|0259|0261|0262|0263|0264|0265|0266|0267|0268|0269|0271|0272|0273|0274|0275|0276|0277|0278|0279|0281|0282|0283|0284|0285|0286|0287|0288|0289|0291|0292|0293|0294|0412|0414|0416|0424|0426)\d{7}$/
    return phonePattern.test(phone)
  },
  
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(amount)
  },
  
  calculateIVA: (amount: number, rate: number = 16): number => {
    return Number((amount * rate / 100).toFixed(2))
  },
  
  calculateISLR: (amount: number, rate: number = 6): number => {
    return Number((amount * rate / 100).toFixed(2))
  },
  
  getAccountTypeByCode: (code: string) => {
    return VENEZUELA_CONSTANTS.ACCOUNT_TYPES.find(type => type.code === code)
  },
  
  getStateByCode: (code: string) => {
    return VENEZUELA_CONSTANTS.VENEZUELAN_STATES.find(state => state.code === code)
  },
  
  isValidEconomicActivity: (code: string): boolean => {
    return VENEZUELA_CONSTANTS.ECONOMIC_ACTIVITIES.some(activity => activity.code === code)
  }
}