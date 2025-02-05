/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  craeteRenderArr,
  createRenderText,
  generateStyleFn,
} from './creators'
import type { OptionCSSStyleDeclaration } from './types'

class RainbowPrint {
  private static instance: RainbowPrint

  private getInstance(): RainbowPrint {
    if (!RainbowPrint.instance) {
      RainbowPrint.instance = new RainbowPrint()
    }
    return RainbowPrint.instance
  }

  public log(...args: any[]): void {
    return window.console.log(
      ...createRenderText(craeteRenderArr(...args)),
    )
  }

  public addStyle<P extends string = string>(
    name: P,
    style: OptionCSSStyleDeclaration,
  ): this & Record<P, ReturnType<typeof generateStyleFn>> {
    const instance = this.getInstance() as any
    if (Object.hasOwn(instance, name)) {
      instance[name] = null
      delete instance[name]
    }
    instance[name] = generateStyleFn(style)
    return instance
  }

  public addStyles<P extends string = string>(
    styles: Record<P, OptionCSSStyleDeclaration>,
  ): this & Record<P, ReturnType<typeof generateStyleFn>> {
    const instance = this.getInstance() as any
    for (const [name, style] of Object.entries(styles)) {
      instance.addStyle(name, style)
    }
    return instance
  }
}

const rainbowPrint = new RainbowPrint().addStyles({
  green: {
    color: '#389e0d',
    'background-color': '#f6ffed',
    padding: '0 2px',
    'border-radius': '2px',
  },
  red: {
    color: '#ff4d4f',
    'background-color': '#fff2f0',
    padding: '0 2px',
    'border-radius': '2px',
  },
})

export default rainbowPrint
export type * from './types'
