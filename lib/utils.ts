import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDeepEqual(obj1: unknown, obj2: unknown): boolean {
  const visited = new WeakMap<object, WeakSet<object>>()

  function deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true

    if (typeof a === 'number' && typeof b === 'number' && Number.isNaN(a) && Number.isNaN(b)) {
      return true
    }

    if (
      typeof a !== 'object' || a === null ||
      typeof b !== 'object' || b === null
    ) {
      return false
    }

    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
      return false
    }

    // Circular reference detection. 
    // If we encounter the same pair (a, b) again on the current recursion path, 
    // it implies they are structurally equivalent within the existing cycle context, 
    // so we return true to break the recursion.
    let visitedForA = visited.get(a)
    if (visitedForA) {
      if (visitedForA.has(b)) return true
    } else {
      visitedForA = new WeakSet()
      visited.set(a, visitedForA)
    }
    visitedForA.add(b)

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime()
    }

    if (a instanceof RegExp && b instanceof RegExp) {
      return a.source === b.source && a.flags === b.flags
    }
    
    if (a instanceof Error && b instanceof Error) {
      // Stack is environment-sensitive, comparing name and message for stability.
      return a.name === b.name && a.message === b.message
    }

    // ArrayBuffer / DataView / TypedArray comparison
    if ((a instanceof ArrayBuffer || a instanceof DataView) && (b instanceof ArrayBuffer || b instanceof DataView)) {
      const viewA = a instanceof ArrayBuffer ? new Uint8Array(a) : new Uint8Array(a.buffer, a.byteOffset, a.byteLength)
      const viewB = b instanceof ArrayBuffer ? new Uint8Array(b) : new Uint8Array(b.buffer, b.byteOffset, b.byteLength)
      if (viewA.length !== viewB.length) return false
      for (let i = 0; i < viewA.length; i++) {
        if (viewA[i] !== viewB[i]) {
          // NaN check: no-op for Uint8Array, but kept for generic TypedArray path (Float32/64Array)
          if (Number.isNaN(viewA[i]) && Number.isNaN(viewB[i])) continue
          return false
        }
      }
      return true
    }
    
    // Check if it's a TypedArray (Uint8Array, Float32Array, etc.)
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b) && !(a instanceof DataView)) {
      const viewA = a as any
      const viewB = b as any
      if (viewA.length !== viewB.length) return false
      for (let i = 0; i < viewA.length; i++) {
        if (viewA[i] !== viewB[i]) {
          if (Number.isNaN(viewA[i]) && Number.isNaN(viewB[i])) continue
          return false
        }
      }
      return true
    }
    
    // Promise/WeakMap/WeakSet are non-comparable
    if (a instanceof Promise || a instanceof WeakMap || a instanceof WeakSet) {
      return false
    }

    // Map comparison: compare entries with one-to-one matching
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false
      const matchedBKeys = new Set<any>()
      
      for (const [aKey, aVal] of a) {
        let found = false
        for (const [bKey, bVal] of b) {
          if (matchedBKeys.has(bKey)) continue
          if (deepEqual(aKey, bKey)) {
            if (deepEqual(aVal, bVal)) {
              matchedBKeys.add(bKey)
              found = true
              break
            }
          }
        }
        if (!found) return false
      }
      return true
    }

    // Set comparison: compare items with one-to-one matching
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false
      const bItems = Array.from(b)
      const matchedBIndices = new Set<number>()
      
      for (const aItem of a) {
        let found = false
        for (let i = 0; i < bItems.length; i++) {
          if (matchedBIndices.has(i)) continue
          if (deepEqual(aItem, bItems[i])) {
            matchedBIndices.add(i)
            found = true
            break
          }
        }
        if (!found) return false
      }
      return true
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false
      }
      return true
    }

    // Plain object comparison (all instance properties + symbols)
    const keys1 = [...Object.getOwnPropertyNames(a), ...Object.getOwnPropertySymbols(a)]
    const keys2 = [...Object.getOwnPropertyNames(b), ...Object.getOwnPropertySymbols(b)]
    if (keys1.length !== keys2.length) return false

    // Objects must have same keys (including non-enumerable and symbols)
    const set2 = new Set<string | symbol>(keys2)
    const objA = a as Record<string | symbol, unknown>
    const objB = b as Record<string | symbol, unknown>
    for (const key of keys1) {
      if (!set2.has(key) || !deepEqual(objA[key], objB[key])) {
        return false
      }
    }

    return true
  }

  return deepEqual(obj1, obj2)
}
