/**
 * Helpers para localStorage com tratamento de erros
 */

export function storageGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage:`, error)
    return defaultValue
  }
}

export function storageSet<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error)
    return false
  }
}

export function storageRemove(key: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Erro ao remover ${key} do localStorage:`, error)
    return false
  }
}

export function storageClear(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error)
    return false
  }
}

/**
 * CRUD genérico para localStorage
 */
export function createStorageCRUD<T extends { id: string }>(storageKey: string) {
  return {
    getAll: (): T[] => storageGet<T[]>(storageKey, []),
    
    getById: (id: string): T | undefined => {
      const items = storageGet<T[]>(storageKey, [])
      return items.find((item) => item.id === id)
    },
    
    create: (item: T): T => {
      const items = storageGet<T[]>(storageKey, [])
      items.push(item)
      storageSet(storageKey, items)
      return item
    },
    
    update: (id: string, updates: Partial<T>): T | undefined => {
      const items = storageGet<T[]>(storageKey, [])
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) return undefined
      
      items[index] = { ...items[index], ...updates }
      storageSet(storageKey, items)
      return items[index]
    },
    
    delete: (id: string): boolean => {
      const items = storageGet<T[]>(storageKey, [])
      const filtered = items.filter((item) => item.id !== id)
      if (filtered.length === items.length) return false
      
      storageSet(storageKey, filtered)
      return true
    },
    
    deleteAll: (): boolean => {
      return storageRemove(storageKey)
    },
  }
}
