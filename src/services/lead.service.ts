import APIBase from './httpBase'
import type { LeadInput } from '@/types'

export interface LeadResponse {
  ok: boolean
  message: string
}

class LeadService extends APIBase {
  /** `website` es un honeypot: los humanos lo dejan vacío, los bots lo llenan. */
  async create(input: LeadInput, website = ''): Promise<LeadResponse> {
    const { data } = await this.post<LeadResponse>('leads', { ...input, website })
    return data
  }
}

export const leadService = new LeadService()
