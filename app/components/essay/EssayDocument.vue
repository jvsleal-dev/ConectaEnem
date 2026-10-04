<script setup>
import EssayAnnotationLayer from './EssayAnnotationLayer.vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: ''
  },
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
  'select-annotation',
  'open-comment-modal'
])

const textContainer = ref(null)
const selectionPopover = ref({
  show: false,
  x: 0,
  y: 0,
  startOffset: 0,
  endOffset: 0,
  text: ''
})

// Quebrar o texto em linhas e calcular offsets reais de caracteres
const lines = computed(() => {
  if (!props.content) return []
  const rawLines = props.content.split('\n')
  let currentOffset = 0

  return rawLines.map((lineText, idx) => {
    const start = currentOffset
    const end = start + lineText.length
    currentOffset = end + 1 // +1 pelo \n
    return {
      index: idx + 1,
      text: lineText,
      startOffset: start,
      endOffset: end
    }
  })
})

// Monitorar seleção de texto para ferramentas de sublinhar/riscar/destacar/comentar
function handleMouseUp() {
  if (props.readOnly) return

  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || !textContainer.value) {
    if (props.activeTool === 'select') {
      selectionPopover.value.show = false
    }
    return
  }

  const selectedText = selection.toString().trim()
  if (!selectedText) {
    selectionPopover.value.show = false
    return
  }

  // Verificar se a seleção está contida no documento
  const range = selection.getRangeAt(0)
  if (!textContainer.value.contains(range.commonAncestorContainer)) {
    return
  }

  const rect = range.getBoundingClientRect()
  const containerRect = textContainer.value.getBoundingClientRect()

  // Calcular offsets no conteúdo original
  const fullText = props.content || ''
  const indexInFull = fullText.indexOf(selectedText)
  const startOffset = indexInFull >= 0 ? indexInFull : 0
  const endOffset = startOffset + selectedText.length

  // Se a ferramenta for 'correct' (Riscar e escrever em cima)
  if (props.activeTool === 'correct') {
    emit('open-comment-modal', {
      selectedText,
      startOffset,
      endOffset,
      isCorrectionMode: true
    })
    selection.removeAllRanges()
    return
  }

  // Se uma ferramenta textual já estiver ativa, criar anotação imediatamente
  if (props.activeTool === 'underline' || props.activeTool === 'strike' || props.activeTool === 'highlighter') {
    let type = 'UNDERLINE'
    if (props.activeTool === 'strike') type = 'STRIKE'
    if (props.activeTool === 'highlighter') type = 'HIGHLIGHT'

    applyTextAnnotation(type, selectedText, startOffset, endOffset)
    selection.removeAllRanges()
    return
  }

  if (props.activeTool === 'comment') {
    emit('open-comment-modal', {
      selectedText,
      startOffset,
      endOffset,
      isCorrectionMode: false
    })
    selection.removeAllRanges()
    return
  }

  // Se a ferramenta for 'select', abrir popover flutuante
  selectionPopover.value = {
    show: true,
    x: rect.left + rect.width / 2 - containerRect.left,
    y: rect.top - containerRect.top - 46,
    startOffset,
    endOffset,
    text: selectedText
  }
}

function applyTextAnnotation(type, selectedText, startOffset, endOffset, extra = {}) {
  const newAnnotation = {
    id: 'ann_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    type,
    color: props.activeColor,
    selectedText,
    startOffset,
    endOffset,
    ...extra
  }
  emit('add-annotation', newAnnotation)
  selectionPopover.value.show = false
}

function handlePopoverAction(toolType) {
  const { text, startOffset, endOffset } = selectionPopover.value
  if (!text) return

  if (toolType === 'CORRECT') {
    emit('open-comment-modal', {
      selectedText: text,
      startOffset,
      endOffset,
      isCorrectionMode: true
    })
  } else if (toolType === 'COMMENT') {
    emit('open-comment-modal', {
      selectedText: text,
      startOffset,
      endOffset,
      isCorrectionMode: false
    })
  } else {
    applyTextAnnotation(toolType, text, startOffset, endOffset)
  }

  const selection = window.getSelection()
  if (selection) selection.removeAllRanges()
  selectionPopover.value.show = false
}

// Renderizar todo o texto com as marcações ativas distribuídas nas linhas pautadas
function renderFullContentHtml() {
  if (!props.content) {
    return '<span class="italic text-slate-400 select-none">Redação em branco ou não digitada.</span>'
  }

  if (!props.showAnnotations || !props.annotations || props.annotations.length === 0) {
    return escapeHtml(props.content)
  }

  const textAnnotations = props.annotations.filter(
    (a) =>
      ['UNDERLINE', 'STRIKE', 'HIGHLIGHT', 'COMMENT'].includes(a.type) &&
      a.startOffset !== null &&
      a.endOffset !== null
  )

  if (textAnnotations.length === 0) {
    return escapeHtml(props.content)
  }

  let result = ''
  const fullText = props.content

  for (let i = 0; i < fullText.length; i++) {
    const globalOffset = i
    const char = fullText[i]

    if (char === '\n') {
      result += '\n'
      continue
    }

    const matchedAnns = textAnnotations.filter(
      (a) => globalOffset >= a.startOffset && globalOffset < a.endOffset
    )

    if (matchedAnns.length === 0) {
      result += escapeHtml(char)
    } else {
      let classNames = []
      let styles = []
      let annIds = matchedAnns.map((a) => a.id).join(' ')
      let badgeHtml = ''

      matchedAnns.forEach((ann) => {
        if (ann.type === 'UNDERLINE') {
          classNames.push('underline decoration-2')
          styles.push(`text-decoration-color: ${ann.color || '#dc2626'}; text-underline-offset: 3px;`)
        } else if (ann.type === 'STRIKE') {
          classNames.push('line-through decoration-2 text-red-600')
          styles.push(`text-decoration-color: ${ann.color || '#dc2626'};`)

          // Se for o último caractere do trecho riscado e houver substituição escrita pelo professor
          if (globalOffset === ann.endOffset - 1 && ann.content) {
            badgeHtml = `<span class="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-lg bg-purple-600 text-white font-sans text-xs font-black shadow-xs align-middle select-none animate-in fade-in zoom-in-90" title="Sugestão do professor"><span class="text-[10px] text-purple-200">✍️</span><span>${escapeHtml(ann.content)}</span></span>`
          }
        } else if (ann.type === 'HIGHLIGHT') {
          classNames.push('rounded-xs px-0.5')
          styles.push(`background-color: ${ann.color ? ann.color + '40' : '#fef08a80'};`)
        } else if (ann.type === 'COMMENT') {
          classNames.push('border-b-2 border-dashed')
          styles.push(`border-bottom-color: ${ann.color || '#7c3aed'}; background-color: ${ann.color ? ann.color + '15' : '#7c3aed15'};`)
        }
      })

      result += `<span class="${classNames.join(' ')} cursor-pointer transition-colors" style="${styles.join(' ')}" data-ann-ids="${annIds}">${escapeHtml(char)}</span>${badgeHtml}`
    }
  }

  return result
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function handleTextClick(e) {
  const target = e.target.closest('[data-ann-ids]')
  if (!target) return

  const ids = target.getAttribute('data-ann-ids').split(' ')
  const annId = ids[0]
  const ann = props.annotations.find((a) => a.id === annId)
  if (ann) {
    if (props.activeTool === 'eraser') {
      emit('remove-annotation', ann.id)
    } else {
      emit('select-annotation', ann)
    }
  }
}
</script>

<template>
  <div class="relative w-full flex justify-center py-2 sm:py-6 px-1 sm:px-4">
    <!-- Papel Pautado Oficial ENEM -->
    <div
      ref="textContainer"
      class="relative w-full max-w-[850px] min-h-[960px] bg-[#fcfbfa] dark:bg-[#18181b] rounded-2xl shadow-xl dark:shadow-2xl border border-slate-300/80 dark:border-zinc-800 p-3 sm:p-8 md:p-10 font-serif text-slate-800 dark:text-zinc-100 transition-all select-text overflow-hidden"
      @mouseup="handleMouseUp"
      @click="handleTextClick"
    >
      <!-- Cabeçalho da Folha de Redação -->
      <div class="border-b-2 border-slate-300 dark:border-zinc-800 pb-3 mb-6 select-none font-sans">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-black text-xs uppercase tracking-wider">
            <span class="material-symbols-rounded text-lg">school</span>
            <span>Folha Oficial de Redação ENEM</span>
          </div>
          <span class="text-[11px] font-bold text-slate-500 dark:text-zinc-400">30 Linhas Máximo</span>
        </div>
        <div v-if="theme" class="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
          <strong class="text-purple-900 dark:text-purple-300">Tema:</strong> {{ theme }}
        </div>
      </div>

      <!-- Título da Redação (se houver) -->
      <div v-if="title" class="text-center font-bold text-base mb-5 text-slate-900 dark:text-zinc-100 underline decoration-purple-300 dark:decoration-purple-600 select-text">
        {{ title }}
      </div>

      <!-- Popover Flutuante de Seleção de Texto (quando activeTool === 'select') -->
      <Transition name="popover">
        <div
          v-if="selectionPopover.show && !readOnly"
          class="absolute z-40 flex items-center gap-1 bg-slate-900 dark:bg-zinc-800 text-white px-2.5 py-1.5 rounded-2xl shadow-2xl border border-slate-700 dark:border-zinc-700 -translate-x-1/2 animate-in fade-in zoom-in-95"
          :style="{ left: `${selectionPopover.x}px`, top: `${selectionPopover.y}px` }"
        >
          <!-- Botão Destaque: Riscar e Escrever em Cima -->
          <button
            type="button"
            title="Riscar e Escrever Correção em Cima"
            @click="handlePopoverAction('CORRECT')"
            class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
          >
            <span class="material-symbols-rounded text-sm">spellcheck</span>
            <span>Corrigir / Escrever</span>
          </button>

          <div class="h-4 w-px bg-slate-700 dark:bg-zinc-700 mx-0.5"></div>

          <button
            type="button"
            title="Sublinhar"
            @click="handlePopoverAction('UNDERLINE')"
            class="flex h-7 w-7 items-center justify-center rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-700 text-amber-300 transition cursor-pointer"
          >
            <span class="material-symbols-rounded text-base">format_underlined</span>
          </button>
          <button
            type="button"
            title="Apenas Riscar / Tachar"
            @click="handlePopoverAction('STRIKE')"
            class="flex h-7 w-7 items-center justify-center rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-700 text-red-400 transition cursor-pointer"
          >
            <span class="material-symbols-rounded text-base">strikethrough_s</span>
          </button>
          <button
            type="button"
            title="Destacar com Marca-texto"
            @click="handlePopoverAction('HIGHLIGHT')"
            class="flex h-7 w-7 items-center justify-center rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-700 text-yellow-300 transition cursor-pointer"
          >
            <span class="material-symbols-rounded text-base">ink_highlighter</span>
          </button>
          <button
            type="button"
            title="Adicionar Comentário Marginal"
            @click="handlePopoverAction('COMMENT')"
            class="flex h-7 w-7 items-center justify-center rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-700 text-purple-300 transition cursor-pointer"
          >
            <span class="material-symbols-rounded text-base">add_comment</span>
          </button>
        </div>
      </Transition>

      <!-- Linhas Numeradas e Folha Pautada Oficial ENEM -->
      <div class="relative flex text-sm sm:text-base tracking-normal select-text">
        <!-- Coluna de Números das Linhas (1 a 30) perfeitamente alinhadas com as pautas -->
        <div class="w-9 shrink-0 select-none border-r-2 border-red-300 dark:border-red-900/60 mr-4 flex flex-col font-sans text-[11px] font-bold text-slate-400 dark:text-zinc-500">
          <div
            v-for="lineNum in 30"
            :key="lineNum"
            class="h-[36px] flex items-center justify-end pr-2.5 transition-colors"
          >
            {{ lineNum }}
          </div>
        </div>

        <!-- Área de Texto com Pautas Azuis Contínuas (cada linha que dobra cai exatamente na linha pautada de baixo) -->
        <div class="relative flex-1 min-h-[1080px]">
          <!-- Camada SVG de Desenho Livre & Marcações Visuais -->
          <EssayAnnotationLayer
            :annotations="annotations"
            :active-tool="activeTool"
            :active-color="activeColor"
            :active-stroke-width="activeStrokeWidth"
            :read-only="readOnly"
            :show-annotations="showAnnotations"
            :selected-annotation-id="selectedAnnotationId"
            @add-annotation="emit('add-annotation', $event)"
            @remove-annotation="emit('remove-annotation', $event)"
            @select-annotation="emit('select-annotation', $event)"
          />

          <!-- Texto do Aluno assentado na malha pautada -->
          <div
            class="ruled-paper-text w-full min-h-[1080px] font-serif text-slate-800 dark:text-zinc-100 whitespace-pre-wrap select-text outline-none"
            v-html="renderFullContentHtml()"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ruled-paper-text {
  line-height: 36px !important;
  font-size: 15px;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 35px,
    rgba(147, 197, 253, 0.45) 35px,
    rgba(147, 197, 253, 0.45) 36px
  );
  background-size: 100% 36px;
  background-position: 0 0;
  box-sizing: border-box;
}

:global(html.dark) .ruled-paper-text,
:global([data-theme="dark"]) .ruled-paper-text {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 35px,
    rgba(96, 165, 250, 0.22) 35px,
    rgba(96, 165, 250, 0.22) 36px
  );
}

.popover-enter-active, .popover-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.popover-enter-from, .popover-leave-to {
  opacity: 0;
  transform: translate(-50%, 6px);
}
</style>
