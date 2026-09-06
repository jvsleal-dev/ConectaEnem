export function useTheme() {
  const themeCookie = useCookie(
    'conectar-enem-student-theme',
    {
      default: () => 'light',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    }
  )

  const theme = useState(
    'conectar-enem-student-theme',
    () => {
      return themeCookie.value === 'dark'
        ? 'dark'
        : 'light'
    }
  )

  const isDark = computed(() => {
    return theme.value === 'dark'
  })

  function setTheme(value) {
    const nextTheme =
      value === 'dark'
        ? 'dark'
        : 'light'

    theme.value = nextTheme
    themeCookie.value = nextTheme
  }

  function toggleTheme() {
    setTheme(
      theme.value === 'dark'
        ? 'light'
        : 'dark'
    )
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}