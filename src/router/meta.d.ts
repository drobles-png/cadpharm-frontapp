// Aumenta RouteMeta para que el router y los guards tengan tipos.
import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    requiresAdmin?: boolean
    guestOnly?: boolean
    /** "admin" usa el layout del panel, sin header ni footer públicos. */
    layout?: 'public' | 'admin' | 'bare'
  }
}
