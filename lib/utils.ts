import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDeepEqual(obj1: any, obj2: any): boolean {
  const visited = new WeakMap<object, WeakSet<object>>()

  function deepEqual(a: any, b: any): boolean {
    // Strict identity (handles primitives, functions, same-ref objects)
    if (a === b) return true

    // Handle NaN
    if (typeof a === 'number' && typeof b === 'number' && Number.isNaN(a) && Number.isNaN(b)) {
      return true
    }

    // Null/non-object guard
    if (
      typeof a !== 'object' || a === null ||
      typeof b !== 'object' || b === null
    ) {
      return false
    }

    // Prototype/constructor mismatch
    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
      return false
    }

    // Circular reference detection
    let visitedForA = visited.get(a)
    if (visitedForA) {
      if (visitedForA.has(b)) return true
    } else {
      visitedForA = new WeakSet()
      visited.set(a, visitedForA)
    }
    visitedForA.add(b)

    // Date comparison
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime()
    }

    // RegExp comparison
    if (a instanceof RegExp && b instanceof RegExp) {
      return a.source === b.source && a.flags === b.flags
    }

    // Map comparison
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false
      for (const [key, val] of a) {
        if (!b.has(key) || !deepEqual(val, b.get(key))) return false
      }
      return true
    }

    // Set comparison
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false
      for (const item of a) {
        // For primitive values, use has(); for objects, fall back to deep search
        if (!a.has(item) || !b.has(item)) {
          // Deep containment check for object elements
          let found = false
          for (const bItem of b) {
            if (deepEqual(item, bItem)) { found = true; break }
          }
          if (!found) return false
        }
      }
      return true
    }

    // Array comparison (ordered)
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false
      }
      return true
    }

    // Catch mismatched types (e.g. Array vs plain object)
    if (Array.isArray(a) !== Array.isArray(b)) return false

    // Plain object comparison
    const keys1 = Object.keys(a)
    const keys2 = Object.keys(b)
    if (keys1.length !== keys2.length) return false

    for (const key of keys1) {
      if (!Object.hasOwn(b, key) || !deepEqual(a[key], b[key])) {
        return false
      }
    }

    return true
  }

  return deepEqual(obj1, obj2)
}
