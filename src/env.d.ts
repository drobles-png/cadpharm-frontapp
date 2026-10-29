/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_META_PIXEL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Cajita de Pagos de Payphone, cargada por script desde su CDN. */
declare class PPaymentButtonBox {
  constructor(config: Record<string, unknown>)
  render(containerId: string): void
}

interface Window {
  PPaymentButtonBox?: typeof PPaymentButtonBox
}
