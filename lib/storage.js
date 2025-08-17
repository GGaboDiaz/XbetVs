// Helpers ultra simples para guardar/leer JSON en localStorage
export const load = (key, fallback) => {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export const save = (key, value) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// IDs rápidos
export const uid = (p="id") => p + "_" + Math.random().toString(36).slice(2,9)
