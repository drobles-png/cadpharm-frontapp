import APIBase from './httpBase'
import type { Product, ProductCategory } from '@/types'

class ProductService extends APIBase {
  async list(category?: ProductCategory): Promise<Product[]> {
    const query = category ? `?category=${category}` : ''
    const { data } = await this.get<Product[]>(`products${query}`)
    return data
  }

  async bySlug(slug: string): Promise<Product> {
    const { data } = await this.get<Product>(`products/${encodeURIComponent(slug)}`)
    return data
  }
}

export const productService = new ProductService()
