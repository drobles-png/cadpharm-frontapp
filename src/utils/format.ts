const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number): string {
  return money.format(value)
}

/** El API maneja todos los montos en centavos. */
export function formatCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return 'Consultar'
  return money.format(cents / 100)
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(value: string | Date): string {
  return dateTime.format(typeof value === 'string' ? new Date(value) : value)
}

/**
 * Las fotos del catálogo inicial viven en /public del frontapp ("/img/...");
 * las que sube el admin vienen de Cloudinary con URL absoluta. Ambas sirven tal cual.
 */
export function imageUrl(path: string | undefined | null): string {
  if (!path) return '/img/placeholder.svg'
  return path
}
