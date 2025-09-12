export function setTheme(theme) {
  const root = document.documentElement

  if (theme === 'dark') {
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    // System preference
    localStorage.removeItem('theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', systemDark)
  }
}

export function initTheme() {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (stored === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    // Respect system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
  }
}
