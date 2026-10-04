<script setup>
const props = defineProps({
  annotations: {
    type: Array,
    default: () => []
  },
  activeTool: {
    type: String,
    default: 'select'
  },
  activeColor: {
    type: String,
    default: '#dc2626'
  },
  activeStrokeWidth: {
    type: Number,
    default: 3
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  showAnnotations: {
    type: Boolean,
    default: true
  },
  selectedAnnotationId: {
    type: String,
    default: null
  }
})

const emit = defineEmits([
  'add-annotation',
  'remove-annotation',
  'select-annotation'
])

const svgContainer = ref(null)
const isDrawing = ref(false)
const isErasing = ref(false)
const currentStroke = ref([])
const startPoint = ref(null)

// Coordenadas relativas de 0 a 1
function getRelativeCoordinates(e) {
  if (!svgContainer.value) return { x: 0, y: 0 }
  const rect = svgContainer.value.getBoundingClientRect()
  const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
  const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0

  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
  return { x, y }
}

function handlePointerDown(e) {
  if (props.readOnly) return

  if (e.target && e.target.setPointerCapture && e.pointerId) {
    try {
      e.target.setPointerCapture(e.pointerId)
    } catch {}
  }

  if (props.activeTool === 'eraser') {
    isErasing.value = true
    checkAndEraseAt(e)
    return
  }

  if (['pen', 'highlighter', 'circle', 'arrow'].includes(props.activeTool)) {
    e.preventDefault()
    isDrawing.value = true
    const pt = getRelativeCoordinates(e)
    startPoint.value = pt
    currentStroke.value = [pt]
  }
}

function handlePointerMove(e) {
  if (props.readOnly) return

  if (props.activeTool === 'eraser' && isErasing.value) {
    checkAndEraseAt(e)
    return
  }

  if (!isDrawing.value) return
  e.preventDefault()
  const pt = getRelativeCoordinates(e)

  if (props.activeTool === 'pen' || props.activeTool === 'highlighter') {
    currentStroke.value.push(pt)
  } else if (props.activeTool === 'circle' || props.activeTool === 'arrow') {
    currentStroke.value = [startPoint.value, pt]
  }
}

function handlePointerUp(e) {
  if (props.readOnly) return

  if (e.target && e.target.releasePointerCapture && e.pointerId) {
    try {
      e.target.releasePointerCapture(e.pointerId)
    } catch {}
  }

  if (props.activeTool === 'eraser') {
    isErasing.value = false
    return
  }

  if (!isDrawing.value) return
  isDrawing.value = false

  if (currentStroke.value.length >= 2) {
    let type = 'DRAW'
    if (props.activeTool === 'highlighter') type = 'HIGHLIGHT'
    if (props.activeTool === 'circle') type = 'CIRCLE'
    if (props.activeTool === 'arrow') type = 'ARROW'

    const newAnnotation = {
      id: 'ann_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type,
      color: props.activeColor,
      strokeWidth: props.activeTool === 'highlighter' ? 14 : props.activeStrokeWidth,
      points: currentStroke.value
    }

    emit('add-annotation', newAnnotation)
  }

  currentStroke.value = []
  startPoint.value = null
}

// Borracha contínua por proximidade (apaga qualquer traço por onde o cursor passa)
function checkAndEraseAt(e) {
  const pt = getRelativeCoordinates(e)
  const threshold = 0.035 // raio de sensibilidade da borracha

  for (const ann of props.annotations) {
    if (!ann.points) continue
    let parsedPoints = ann.points
    if (typeof parsedPoints === 'string') {
      try {
        parsedPoints = JSON.parse(parsedPoints)
      } catch {
        continue
      }
    }

    if (Array.isArray(parsedPoints)) {
      const hit = parsedPoints.some((p) => {
        const dx = p.x - pt.x
        const dy = p.y - pt.y
        return Math.sqrt(dx * dx + dy * dy) < threshold
      })

      if (hit) {
        emit('remove-annotation', ann.id)
        break
      }
    }
  }
}

function pointsToSvgPath(points, isRelative = true) {
  if (!points || !points.length) return ''
  let parsedPoints = points
  if (typeof points === 'string') {
    try {
      parsedPoints = JSON.parse(points)
    } catch {
      return ''
    }
  }
  if (!Array.isArray(parsedPoints) || parsedPoints.length === 0) return ''

  const width = 1000
  const height = 1000

  const getX = (p) => (isRelative ? p.x * width : p.x)
  const getY = (p) => (isRelative ? p.y * height : p.y)

  let d = `M ${getX(parsedPoints[0])} ${getY(parsedPoints[0])}`
  for (let i = 1; i < parsedPoints.length; i++) {
    d += ` L ${getX(parsedPoints[i])} ${getY(parsedPoints[i])}`
  }
  return d
}

function pointsToCircle(points, isRelative = true) {
  let parsedPoints = points
  if (typeof points === 'string') {
    try {
      parsedPoints = JSON.parse(points)
    } catch {
      return null
    }
  }
  if (!Array.isArray(parsedPoints) || parsedPoints.length < 2) return null

  const width = 1000
  const height = 1000
  const p1 = parsedPoints[0]
  const p2 = parsedPoints[parsedPoints.length - 1]

  const x1 = isRelative ? p1.x * width : p1.x
  const y1 = isRelative ? p1.y * height : p1.y
  const x2 = isRelative ? p2.x * width : p2.x
  const y2 = isRelative ? p2.y * height : p2.y

  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  const rx = Math.abs(x2 - x1) / 2
  const ry = Math.abs(y2 - y1) / 2

  return { cx, cy, rx, ry }
}

function pointsToArrow(points, isRelative = true) {
  let parsedPoints = points
  if (typeof points === 'string') {
    try {
      parsedPoints = JSON.parse(points)
    } catch {
      return null
    }
  }
  if (!Array.isArray(parsedPoints) || parsedPoints.length < 2) return null

  const width = 1000
  const height = 1000
  const p1 = parsedPoints[0]
  const p2 = parsedPoints[parsedPoints.length - 1]

  const x1 = isRelative ? p1.x * width : p1.x
  const y1 = isRelative ? p1.y * height : p1.y
  const x2 = isRelative ? p2.x * width : p2.x
  const y2 = isRelative ? p2.y * height : p2.y

  const angle = Math.atan2(y2 - y1, x2 - x1)
  const headLen = 16
  const arrowX1 = x2 - headLen * Math.cos(angle - Math.PI / 6)
  const arrowY1 = y2 - headLen * Math.sin(angle - Math.PI / 6)
  const arrowX2 = x2 - headLen * Math.cos(angle + Math.PI / 6)
  const arrowY2 = y2 - headLen * Math.sin(angle + Math.PI / 6)

  return {
    linePath: `M ${x1} ${y1} L ${x2} ${y2}`,
    headPath: `M ${arrowX1} ${arrowY1} L ${x2} ${y2} L ${arrowX2} ${arrowY2}`
  }
}

function handleAnnotationClick(ann, e) {
  e.stopPropagation()
  if (props.activeTool === 'eraser') {
    emit('remove-annotation', ann.id)
  } else {
    emit('select-annotation', ann)
  }
}
</script>

<template>
  <div
    ref="svgContainer"
    class="absolute inset-0 z-10 select-none overflow-hidden touch-none"
    :class="[
      readOnly ? 'pointer-events-none' : '',
      activeTool === 'eraser' ? 'cursor-not-allowed pointer-events-auto' : '',
      ['pen', 'highlighter', 'circle', 'arrow'].includes(activeTool) ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
    ]"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerUp"
  >
    <svg
      v-if="showAnnotations"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      class="w-full h-full"
    >
      <!-- Anotações Existentes -->
      <g v-for="ann in annotations" :key="ann.id" class="annotation-item">
        <!-- FREE DRAW / PEN (COM HITBOX LARGA INVISÍVEL PARA APAGAR COM FACILIDADE) -->
        <g v-if="ann.type === 'DRAW' && ann.points">
          <!-- Hitbox larga para clique e borracha -->
          <path
            :d="pointsToSvgPath(ann.points)"
            stroke="transparent"
            stroke-width="22"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            class="pointer-events-auto cursor-pointer"
            @click="handleAnnotationClick(ann, $event)"
          />
          <path
            :d="pointsToSvgPath(ann.points)"
            :stroke="ann.color || '#dc2626'"
            :stroke-width="ann.strokeWidth || 3"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            class="transition-opacity duration-150 pointer-events-none"
            :class="[
              selectedAnnotationId === ann.id ? 'opacity-100 stroke-[4.5]' : 'opacity-90'
            ]"
          />
        </g>

        <!-- FREEFORM HIGHLIGHTER -->
        <path
          v-else-if="ann.type === 'HIGHLIGHT' && ann.points"
          :d="pointsToSvgPath(ann.points)"
          :stroke="ann.color || '#fef08a'"
          :stroke-width="ann.strokeWidth || 14"
          stroke-linecap="square"
          stroke-linejoin="round"
          stroke-opacity="0.45"
          fill="none"
          class="pointer-events-auto cursor-pointer transition-opacity hover:stroke-opacity-80"
          @click="handleAnnotationClick(ann, $event)"
        />

        <!-- CIRCLE / FORMA CIRCULAR (COM HITBOX LARGA) -->
        <g v-else-if="ann.type === 'CIRCLE' && pointsToCircle(ann.points)">
          <ellipse
            :cx="pointsToCircle(ann.points).cx"
            :cy="pointsToCircle(ann.points).cy"
            :rx="pointsToCircle(ann.points).rx"
            :ry="pointsToCircle(ann.points).ry"
            stroke="transparent"
            stroke-width="20"
            fill="none"
            class="pointer-events-auto cursor-pointer"
            @click="handleAnnotationClick(ann, $event)"
          />
          <ellipse
            :cx="pointsToCircle(ann.points).cx"
            :cy="pointsToCircle(ann.points).cy"
            :rx="pointsToCircle(ann.points).rx"
            :ry="pointsToCircle(ann.points).ry"
            :stroke="ann.color || '#dc2626'"
            :stroke-width="ann.strokeWidth || 3"
            stroke-dasharray="3,3"
            fill="none"
            class="pointer-events-none transition-opacity"
          />
        </g>

        <!-- ARROW / SETA (COM HITBOX LARGA) -->
        <g
          v-else-if="ann.type === 'ARROW' && pointsToArrow(ann.points)"
          class="pointer-events-auto cursor-pointer"
          @click="handleAnnotationClick(ann, $event)"
        >
          <!-- Hitbox -->
          <path
            :d="pointsToArrow(ann.points).linePath"
            stroke="transparent"
            stroke-width="22"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Visual -->
          <path
            :d="pointsToArrow(ann.points).linePath"
            :stroke="ann.color || '#dc2626'"
            :stroke-width="ann.strokeWidth || 3"
            stroke-linecap="round"
            fill="none"
          />
          <path
            :d="pointsToArrow(ann.points).headPath"
            :stroke="ann.color || '#dc2626'"
            :stroke-width="ann.strokeWidth || 3"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </g>
      </g>

      <!-- Traçado em Tempo Real enquanto desenha -->
      <g v-if="isDrawing && currentStroke.length > 1">
        <path
          v-if="activeTool === 'pen'"
          :d="pointsToSvgPath(currentStroke)"
          :stroke="activeColor"
          :stroke-width="activeStrokeWidth"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          opacity="0.9"
        />

        <path
          v-else-if="activeTool === 'highlighter'"
          :d="pointsToSvgPath(currentStroke)"
          :stroke="activeColor"
          :stroke-width="14"
          stroke-linecap="square"
          stroke-linejoin="round"
          stroke-opacity="0.4"
          fill="none"
        />

        <ellipse
          v-else-if="activeTool === 'circle' && pointsToCircle(currentStroke)"
          :cx="pointsToCircle(currentStroke).cx"
          :cy="pointsToCircle(currentStroke).cy"
          :rx="pointsToCircle(currentStroke).rx"
          :ry="pointsToCircle(currentStroke).ry"
          :stroke="activeColor"
          :stroke-width="activeStrokeWidth"
          stroke-dasharray="3,3"
          fill="none"
        />

        <g v-else-if="activeTool === 'arrow' && pointsToArrow(currentStroke)">
          <path
            :d="pointsToArrow(currentStroke).linePath"
            :stroke="activeColor"
            :stroke-width="activeStrokeWidth"
            stroke-linecap="round"
            fill="none"
          />
          <path
            :d="pointsToArrow(currentStroke).headPath"
            :stroke="activeColor"
            :stroke-width="activeStrokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  </div>
</template>
