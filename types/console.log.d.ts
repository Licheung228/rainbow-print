import type RainbowPrint from '../dist'
declare global {
  interface Console {
    color: RainbowPrint['log']
  }
}
export {}
