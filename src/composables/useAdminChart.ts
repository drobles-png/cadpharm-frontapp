import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface ChartPoint {
  date: string
  total: number
  orders: number
}

const PAD = { top: 18, right: 12, bottom: 28, left: 12 }

/**
 * Geometría del gráfico de ventas. Se mide el ancho real del contenedor para
 * dibujar en píxeles: así la línea no se deforma (con viewBox estirado el
 * trazo se aplasta) y el tooltip cae exactamente sobre el punto.
 */
export function useAdminChart(data: Ref<ChartPoint[]>, el: Ref<HTMLElement | null>, height = 240) {
  const width = ref(600)
  const active = ref<number | null>(null)
  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (!el.value) return
    width.value = el.value.clientWidth || 600
    observer = new ResizeObserver(([entry]) => {
      if (entry) width.value = Math.max(240, entry.contentRect.width)
    })
    observer.observe(el.value)
  })
  onUnmounted(() => observer?.disconnect())

  const max = computed(() => {
    const top = Math.max(0, ...data.value.map((d) => d.total))
    // Techo "redondo" para que el pico no toque el borde superior.
    return top > 0 ? top * 1.15 : 1
  })

  const points = computed(() => {
    const n = data.value.length
    const innerW = width.value - PAD.left - PAD.right
    const innerH = height - PAD.top - PAD.bottom
    return data.value.map((d, i) => ({
      x: PAD.left + (n > 1 ? (innerW * i) / (n - 1) : innerW / 2),
      y: PAD.top + innerH - (d.total / max.value) * innerH,
      ...d,
    }))
  })

  /** Curva suave (Catmull-Rom a Bézier) para que no se vea como serrucho. */
  const linePath = computed(() => {
    const p = points.value
    if (!p.length) return ''
    let path = `M${p[0]!.x},${p[0]!.y}`
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] ?? p[i]!
      const p1 = p[i]!
      const p2 = p[i + 1]!
      const p3 = p[i + 2] ?? p2
      const c1x = p1.x + (p2.x - p0.x) / 6
      const c1y = Math.min(p1.y + (p2.y - p0.y) / 6, height - PAD.bottom)
      const c2x = p2.x - (p3.x - p1.x) / 6
      const c2y = Math.min(p2.y - (p3.y - p1.y) / 6, height - PAD.bottom)
      path += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
    }
    return path
  })

  const areaPath = computed(() => {
    const p = points.value
    if (!p.length) return ''
    const base = height - PAD.bottom
    return `${linePath.value} L${p[p.length - 1]!.x},${base} L${p[0]!.x},${base} Z`
  })

  /** Unas pocas líneas guía horizontales, sin ejes pesados. */
  const gridLines = computed(() => {
    const innerH = height - PAD.top - PAD.bottom
    return [0, 0.5, 1].map((f) => PAD.top + innerH * f)
  })

  /** Cinco fechas repartidas en el eje X. */
  const labels = computed(() => {
    const p = points.value
    if (p.length < 2) return p
    const step = (p.length - 1) / 4
    return [0, 1, 2, 3, 4].map((i) => p[Math.round(i * step)]!)
  })

  function pick(clientX: number) {
    if (!el.value || !points.value.length) return
    const x = clientX - el.value.getBoundingClientRect().left
    let best = 0
    points.value.forEach((pt, i) => {
      if (Math.abs(pt.x - x) < Math.abs(points.value[best]!.x - x)) best = i
    })
    active.value = best
  }

  const activePoint = computed(() =>
    active.value === null ? null : (points.value[active.value] ?? null),
  )

  return {
    width,
    height,
    points,
    linePath,
    areaPath,
    gridLines,
    labels,
    activePoint,
    pick,
    clear: () => (active.value = null),
  }
}
