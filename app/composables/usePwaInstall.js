// Composable reativo para capturar e gerenciar a instalação do App PWA
export function usePwaInstall() {
  const deferredPrompt = ref(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)
  const isIos = ref(false)

  onMounted(() => {
    if (typeof window === 'undefined') return

    // Checar se já está rodando em modo standalone / instalado
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      isInstalled.value = true
    }

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    isIos.value = /iphone|ipad|ipod/.test(userAgent)

    // Capturar o evento de instalação nativo
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
      isInstallable.value = false
      isInstalled.value = true
    })
  })

  async function promptInstall() {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      if (outcome === 'accepted') {
        isInstallable.value = false
        deferredPrompt.value = null
      }
      return outcome
    }
    return null
  }

  return {
    deferredPrompt,
    isInstallable,
    isInstalled,
    isIos,
    promptInstall
  }
}
