/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { StringSubsitution, SymbolType } from './constant'
import type { Item, OptionCSSStyleDeclaration } from './types'

export function createStyle(style: OptionCSSStyleDeclaration): string {
  return Object.entries(style)
    .map(([key, value]) => `${key}: ${value};`)
    .join('')
}

export function createColorString(
  style: OptionCSSStyleDeclaration,
  text: string,
): Item {
  // const textStyle = createStyle(style)
  const i = Object.create(null) as Item
  i.sub = StringSubsitution['string']
  // value 就是 子串后的 style + text
  i.value = [style, text]
  i[SymbolType] = 'string'

  return i
}

export function createRenderItem(arg: any): Item {
  let i = Object.create(null) as Item
  i.value = arg
  switch (typeof arg) {
    /*
      if is a pure string , transform it to a color string that color is black
      if use `%o` to substitution , it will be show like 'string'(orange), 
      but when pure string loged, it is black and without quotes
    */
    case 'string':
      i = createColorString({ color: '#000' }, arg)
      break
    default:
      i[SymbolType] = 'other'
      i.sub = StringSubsitution['other']
      break
  }

  return i
}

export function craeteRenderArr(...args: any[]): Item[] {
  const arr: Item[] = []
  args.forEach((i) => {
    arr.push(i[SymbolType] ? i : createRenderItem(i))
  })
  return arr
}

export function transString(string: string): string {
  // replace all `%` ==> `%%`, otherwise it will be use as a substitution
  return string.replace(/%/g, '%%')
}

function splitStyleAndText(value: any[]) {
  const [style, ...text] = value
  return { style, text }
}

export function createRenderText(itemArr: Item[]): any[] {
  const re: any[] = []
  const subsitutionArr = []
  for (const i of itemArr) {
    subsitutionArr.push(i.sub)
    if (i[SymbolType] === 'string') {
      const { style, text } = splitStyleAndText(i.value)
      re.push(createStyle(style))
      re.push(...text.map(transString))
    } else {
      re.push(i.value)
    }
  }
  re.unshift(subsitutionArr.join(''))
  return re
}

export function generateStyleFn(style: OptionCSSStyleDeclaration) {
  /*
    TODO optimize if params is a Item, should assign the style be like:
    const bgGreen = generatorStyleFn({ 'background-color': 'green' })
    const green = generatorStyleFn({ color: 'green' })
    // should be able to use like:
    bgGreen(green('here is a string'))
  */
  const generateStyle = (...args: Array<string | Item>): Item => {
    const content: string[] = []
    args.forEach((i) => {
      if (typeof i === 'string') {
        content.push(i as string)
      } else if (i[SymbolType] === 'string') {
        const { style: iStyle, text } = splitStyleAndText(i.value)
        /*
          merge style, the main style should be out of this function. be like:
          const bgGreen = generatorStyleFn({ 'background-color': 'green', folor: 'red' })
          const green = generatorStyleFn({ color: 'green' })
          
          log(bgGreen(green('here is a string'))
          //⬆️now, the color should be red
        */
        style = Object.assign(iStyle, style)
        content.push(...text.map(transString))
      }
    })

    return createColorString(style, content.join(' '))
  }

  return generateStyle
}
