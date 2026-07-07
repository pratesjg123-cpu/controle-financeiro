import { STORAGE_KEY } from './constants'

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { months: {} }
    const parsed = JSON.parse(raw)
    if (!parsed.months) return { months: {} }
    return parsed
  } catch (e) {
    console.error('Erro ao ler dados do localStorage:', e)
    return { months: {} }
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Erro ao salvar dados no localStorage:', e)
  }
}
