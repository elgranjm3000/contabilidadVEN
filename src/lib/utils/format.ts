export const formatCurrency = (amount: number, currency = 'VES') => {
  if (currency === 'VES') {
    return `Bs. ${amount.toLocaleString('es-VE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`
  }
  
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount)
}

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return dateObj.toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  })
}

export const formatNumber = (number: number, decimals = 2) => {
  return number.toLocaleString('es-VE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}