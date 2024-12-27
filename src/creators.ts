/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { StringSubsitution, SymbolType } from './constant'
import type { Item, OptionCSSStyleDeclaration } from './types'

/**
 * create a style string
 * @param {OptionCSSStyleDeclaration} style style of the string
 * @returns {string} a style string
 * @description transform a style object to inline style string
 * @example
 * createStyle({ color: '#000', 'background-color': 'skyblue' }) // 'color: #000;background-color: skyblue;'
 */
export function createStyle(style: OptionCSSStyleDeclaration): string {
  return Object.entries(style)
    .map(([key, value]) => `${key}: ${value};`)
    .join('')
}

/**
 * create a color string
 * @param {OptionCSSStyleDeclaration} style style of the string
 * @param {string} text content of the string
 * @returns {Item} a Item object
 * @returns {Item.sub} a string that can be used in `console.log` as a substitution. must be `%c%s`
 * @returns {Item.value} a array that contains style and text. the first element is style, the second is text ( although text maybe multiple strings, but it will be merged to one string and accept by createColorString function)
 */
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

/**
 * create a Item object
 * @param {any} arg value of the Item
 * @returns {Item} a Item object
 * @returns {Item.value} value of the Item
 * @returns {Item.sub} a string that can be used in `console.log` as a substitution. must be `%o`
 */
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
    arr.push(i?.[SymbolType] ? i : createRenderItem(i))
  })
  return arr
}

/**
 * transform string and replace all `%` to `%%`
 * @param {string} string need to be transformed
 * @returns {string} transformed string
 *
 * @example
 * transString('hello %s') // 'hello %%s'
 */
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
    - status: complete [✅ - 2024-12-22]
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
        /*
          Todo"
          this way is not good,
          if multiple Item have different style, the style will be override by the last one
          be like : 
            console.color(
              bgPink(green('here is bg-pink green'), blod('and font-bold')),
            )

          the font-weight of green('here is bg-pink green') maybe shouldn't be bold, but with this way, it will be

          maybe I can change return value. now is a Item, maybe can be a array should be sign.
        */
        content.push(...text.map(transString))
      }
    })

    return createColorString(style, content.join(' '))
  }

  return generateStyle
}
