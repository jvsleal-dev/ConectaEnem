export function useStudentShell() {
  const sidebarCookie = useCookie(
    'conectar-enem-student-sidebar',
    {
      default: () => 'expanded',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    }
  )

  const sidebarCollapsed = useState(
    'conectar-enem-student-sidebar',
    () => {
      return sidebarCookie.value === 'collapsed'
    }
  )

  function setSidebarCollapsed(value) {
    const collapsed = Boolean(value)

    sidebarCollapsed.value = collapsed

    sidebarCookie.value =
      collapsed
        ? 'collapsed'
        : 'expanded'
  }

  function toggleSidebar() {
    setSidebarCollapsed(
      !sidebarCollapsed.value
    )
  }

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar
  }
}