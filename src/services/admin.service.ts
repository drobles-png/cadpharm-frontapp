import APIBase from './httpBase'
import type {
  AdminStats,
  Lead,
  LeadStatus,
  LeadType,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductInput,
} from '@/types'

export interface OrderQuery {
  status?: OrderStatus | ''
  q?: string
  page?: number
  limit?: number
}

export interface LeadQuery {
  status?: LeadStatus | ''
  type?: LeadType | ''
  page?: number
  limit?: number
}

/** Arma el querystring omitiendo vacíos: el API trata "status=" distinto de no mandarlo. */
function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value))
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    const { data } = await this.get<AdminStats>('admin/stats')
    return data
  }

  // ─── Productos ───────────────────────────────────────────────────────

  async products(): Promise<Product[]> {
    const { data } = await this.get<Product[]>('admin/products')
    return data
  }

  async product(id: string): Promise<Product> {
    const { data } = await this.get<Product>(`admin/products/${encodeURIComponent(id)}`)
    return data
  }

  async createProduct(input: ProductInput): Promise<Product> {
    const { data } = await this.post<Product>('admin/products', input)
    return data
  }

  async updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
    const { data } = await this.patch<Product>(`admin/products/${encodeURIComponent(id)}`, input)
    return data
  }

  async deleteProduct(id: string): Promise<{ ok: boolean }> {
    const { data } = await this.delete<{ ok: boolean }>(`admin/products/${encodeURIComponent(id)}`)
    return data
  }

  /** Sube una imagen a Cloudinary. 503 = Cloudinary sin configurar. */
  async upload(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await this.post<{ url: string }>('admin/uploads', form, undefined, {
      timeout: 60000,
    })
    return data.url
  }

  // ─── Pedidos ─────────────────────────────────────────────────────────

  async orders(query: OrderQuery = {}): Promise<Paginated<Order>> {
    const { data } = await this.get<Paginated<Order>>(
      `admin/orders${toQuery({ ...query })}`,
    )
    return data
  }

  async order(id: string): Promise<Order> {
    const { data } = await this.get<Order>(`admin/orders/${encodeURIComponent(id)}`)
    return data
  }

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    const body = note ? { status, note } : { status }
    const { data } = await this.patch<Order>(
      `admin/orders/${encodeURIComponent(id)}/status`,
      body,
    )
    return data
  }

  // ─── Mensajes ────────────────────────────────────────────────────────

  async leads(query: LeadQuery = {}): Promise<Paginated<Lead>> {
    const { data } = await this.get<Paginated<Lead>>(`admin/leads${toQuery({ ...query })}`)
    return data
  }

  async updateLead(id: string, input: { status?: LeadStatus; note?: string }): Promise<Lead> {
    const { data } = await this.patch<Lead>(`admin/leads/${encodeURIComponent(id)}`, input)
    return data
  }
}

export const adminService = new AdminService()
