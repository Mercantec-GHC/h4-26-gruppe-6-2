import { APPS, AppItem } from '../data/apps'

export const findApp = (input: string): AppItem | null => {
  const value = input.trim().toLowerCase()

  return (
    APPS.find(app =>
      app.keywords.some(keyword =>
        value.includes(keyword.toLowerCase())
      )
    ) || null
  )
}

export const searchApps = (input: string): AppItem[] => {
  const value = input.trim().toLowerCase()

  if (!value) return []

  return APPS.filter(app =>
    app.name.toLowerCase().includes(value)
  )
}
