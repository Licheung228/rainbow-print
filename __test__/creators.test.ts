import { test, expect, describe } from 'vitest'
import {
  transString,
  createColorString,
  createStyle,
  splitStyleAndText,
  createRenderPrintItem,
  craeteRenderArr,
  createRenderText,
  generateStyleFn,
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

describe('splitStyleAndText', () => {
  test('should split style and text correctly', () => {
    const value = [{ color: 'red' }, 'Hello, World!']
    const result = splitStyleAndText(value)
    expect(result.style).toEqual({ color: 'red' })
    expect(result.text).toEqual(['Hello, World!'])
  })

  test('should handle empty style', () => {
    const value = [{}, 'Text only']
    const result = splitStyleAndText(value)
    expect(result.style).toEqual({})
    expect(result.text).toEqual(['Text only'])
  })

  test('should handle multiple text parts', () => {
    const value = [{ fontSize: '16px' }, 'Line 1', 'Line 2']
    const result = splitStyleAndText(value)
    expect(result.style).toEqual({ fontSize: '16px' })
    expect(result.text).toEqual(['Line 1', 'Line 2'])
  })
})

describe('createRenderPrintItem', () => {
  test('should handle string input', () => {
    const result = createRenderPrintItem('test')
    expect(result).toEqual({
      sub: '%c%s',
      value: [{ color: '#000' }, 'test'],
      [SymbolType]: 'string',
    })
  })

  test('should handle non-string input', () => {
    const obj = { key: 'value' }
    const result = createRenderPrintItem(obj)
    expect(result).toEqual({
      value: obj,
      sub: '%o',
      [SymbolType]: 'other',
    })
  })
})

describe('craeteRenderArr', () => {
  test('should handle mixed inputs', () => {
    const result = craeteRenderArr('text', { key: 'value' })
    expect(result).toHaveLength(2)
    expect(result[0][SymbolType]).toBe('string')
    expect(result[1][SymbolType]).toBe('other')
  })

  test('should preserve existing PrintItems', () => {
    const printItem = createColorString({ color: 'red' }, 'test')
    const result = craeteRenderArr(printItem)
    expect(result[0]).toBe(printItem)
  })

  test('should handle empty array', () => {
    const result = craeteRenderArr()
    expect(result).toEqual([])
  })
})

describe('createRenderText', () => {
  test('should handle string type items', () => {
    const items = [createColorString({ color: 'red' }, 'test')]
    const result = createRenderText(items)
    expect(result[0]).toBe('%c%s')
    expect(result[1]).toBe('color: red;')
    expect(result[2]).toBe('test')
  })

  test('should handle other type items', () => {
    const obj = { test: true }
    const items = [createRenderPrintItem(obj)]
    const result = createRenderText(items)
    expect(result[0]).toBe('%o')
    expect(result[1]).toBe(obj)
  })
})

describe('generateStyleFn', () => {
  test('should create styled string', () => {
    const redText = generateStyleFn({ color: 'red' })
    const result = redText('test')
    expect(result).toEqual({
      sub: '%c%s',
      value: [{ color: 'red' }, 'test'],
      [SymbolType]: 'string',
    })
  })

  test('should handle nested styles', () => {
    const redText = generateStyleFn({ color: 'red' })
    const boldText = generateStyleFn({ 'font-weight': 'bold' })
    const result = redText(boldText('test'))
    expect(result.value[0]).toEqual({
      color: 'red',
      'font-weight': 'bold',
    })
  })

  test('should throw error for invalid input', () => {
    const redText = generateStyleFn({ color: 'red' })
    expect(() => redText({ invalid: true } as any)).toThrow(
      'not a string or PrintItem',
    )
  })
})
