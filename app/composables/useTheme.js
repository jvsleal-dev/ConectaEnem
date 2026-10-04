/**
 * useTheme - Thin wrapper around @nuxtjs/color-mode (provided by @nuxt/ui)
 *
 * @nuxtjs/color-mode automatically manages the `dark` class on <html> and
 * persists the preference to localStorage/cookie using the key defined in nuxt.config.js.
 * We simply expose helpers to toggle and query the current theme.
 */
export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')

  const theme = computed(() => isDark.value ? 'dark' : 'light')

  function applyThemeToDOM(val) {
    if (import.meta.client) {
      const root = document.documentElement
      if (val === 'dark') {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      }
    }
  }

  function setTheme(value) {
    const next = value === 'dark' ? 'dark' : 'light'
    colorMode.preference = next
    applyThemeToDOM(next)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  // Ensure DOM stays in sync on mount (handles SSR hydration & initial page load)
  if (import.meta.client) {
    onMounted(() => {
      applyThemeToDOM(colorMode.value === 'dark' ? 'dark' : 'light')
    })

    watch(() => colorMode.value, (val) => {
      applyThemeToDOM(val === 'dark' ? 'dark' : 'light')
    })
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}