import { useEffect, useState } from 'react'

const STORAGE_KEY = 'smartcrm-theme'

function getStoredTheme() {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY)
  return savedTheme === 'dark' ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(() => getStoredTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    toggleTheme,
  }
}
