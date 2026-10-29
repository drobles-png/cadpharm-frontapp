import APIBase from './httpBase'
import type { PublicConfig } from '@/types'

class ConfigService extends APIBase {
  async load(): Promise<PublicConfig> {
    const { data } = await this.get<PublicConfig>('config')
    return data
  }
}

export const configService = new ConfigService()
