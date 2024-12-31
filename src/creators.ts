/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { StringSubsitution, SymbolType } from './constant'
import type { PrintItem, OptionCSSStyleDeclaration } from './types'

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
 * @returns {PrintItem} a PrintItem object
 * @returns {PrintItem.sub} a string that can be used in `console.log` as a substitution. must be `%c%s`
 * @returns {PrintItem.value} a array that contains style and text. the first element is style, the second is text ( although text maybe multiple strings, but it will be merged to one string and accept by createColorString function)
 */
export function createColorString(
  style: OptionCSSStyleDeclaration,
  text: string,
): PrintItem {
  // const textStyle = createStyle(style)
  const i = Object.create(null) as PrintItem
  i.sub = StringSubsitution['string']
  // value 就是 子串后的 style + text
  i.value = [style, text]
  i[SymbolType] = 'string'

  return i
}

/**
 * create a PrintItem object
 * @param {any} arg value of the PrintItem
 * @returns {PrintItem} a PrintItem object
 * @returns {PrintItem.value} value of the PrintItem
 * @returns {PrintItem.sub} a string that can be used in `console.log` as a substitution. must be `%o`
 */
export function createRenderPrintItem(arg: any): PrintItem {
  let i = Object.create(null) as PrintItem
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

export function craeteRenderArr(...args: any[]): PrintItem[] {
  const arr: PrintItem[] = []
  args.forEach((i) => {
    arr.push(i?.[SymbolType] ? i : createRenderPrintItem(i))
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

/**
 * split style and text
 * @param {any[]} value
 * @returns {style: string, text: string[]}
 */
export function splitStyleAndText(value: any[]): {
  style: OptionCSSStyleDeclaration
  text: string[]
} {
  const [style, ...text] = value as [
    OptionCSSStyleDeclaration,
    ...string[],
  ]
  return { style, text }
}

/**
 * create render text
 * @param {PrintItem[]}
 * @returns {any[]}
 * @description trans PrintItems to console.log item
 */
export function createRenderText(PrintItemArr: PrintItem[]): any[] {
  const re: any[] = []
  const subsitutionArr = []
  for (const i of PrintItemArr) {
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

/**
 * generate style function
 * @param {OptionCSSStyleDeclaration}
 * @returns {Function}
 * @description generate a function to create a print item generator
 */
export function generateStyleFn(style: OptionCSSStyleDeclaration) {
  /*
    TODO optimize if params is a PrintItem, should assign the style be like:
    - status: complete [✅ - 2024-12-22]
    const bgGreen = generatorStyleFn({ 'background-color': 'green' })
    const green = generatorStyleFn({ color: 'green' })
    // should be able to use like:
    bgGreen(green('here is a string'))
  */

  const generateStyle = (
    ...args: Array<string | PrintItem>
  ): PrintItem => {
    const content: string[] = []
    // prevent style be override ( pollution )
    let _style = { ...style }

    args.forEach((i) => {
      if (typeof i === 'string') {
        content.push(i)
      } else if (i[SymbolType] === 'string') {
        const { style: iStyle, text } = splitStyleAndText(i.value)
        /*
          merge style, the main style should be out of this function. be like:
          const bgGreen = generatorStyleFn({ 'background-color': 'green', folor: 'red' })
          const green = generatorStyleFn({ color: 'green' })
          
          log(bgGreen(green('here is a string'))
          //⬆️now, the color should be red
        */
        _style = { ...iStyle, ...style }
        /*
          Todo"
          this way is not good,
          if multiple PrintItem have different style, the style will be override by the last one
          be like : 
            console.color(
              bgPink(green('here is bg-pink green'), blod('and font-bold')),
            )

          the font-weight of green('here is bg-pink green') maybe shouldn't be bold, but with this way, it will be

          maybe I can change return value. now is a PrintItem, maybe can be a array should be sign.
        */
        /*
          2024-12-31 maybe should refactor...
       */
        content.push(...text.map(transString))
      } else {
        throw new Error('not a string or PrintItem')
      }
    })

    return createColorString(_style, content.join(' '))
  }

  return generateStyle
}
