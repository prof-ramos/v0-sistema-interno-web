import test from 'node:test'
import assert from 'node:assert/strict'

import { createDataSnapshot } from '../hooks/use-debounce.ts'

test('createDataSnapshot is stable for objects with different key order', () => {
  const first = createDataSnapshot({ b: 2, a: 1, nested: { d: 4, c: 3 } })
  const second = createDataSnapshot({ nested: { c: 3, d: 4 }, a: 1, b: 2 })

  assert.equal(first, second)
})

test('createDataSnapshot changes when nested values change', () => {
  const first = createDataSnapshot({ perfil: { nome: 'Ana', setor: 'TI' } })
  const second = createDataSnapshot({ perfil: { nome: 'Ana', setor: 'RH' } })

  assert.notEqual(first, second)
})
