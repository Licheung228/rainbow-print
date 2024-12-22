import { test, expect } from 'vitest'
import {
  transString,
  createColorString,
  createStyle,
} from '../src/creators'
import { SymbolType } from '../src/constant'

test('transString', () => {
  expect(transString('hello %s')).toBe('hello %%s')
})

test('createColorString', () => {
  const style = { color: '#000' }
  const text = 'hello'
  const result = createColorString(style, text)

  expect(result).toEqual({
    sub: '%c%s',
    value: [style, text],
    [SymbolType]: 'string',
  })
})

test('createStyle', () => {
  const re = createStyle({
    color: '#000',
    'background-color': 'skyblue',
  })
  expect(re).toBe('color: #000;background-color: skyblue;')
})

// describe('creators', () => {

// })
