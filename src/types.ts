/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StringSubsitution, SymbolType } from './constant'

export interface Item {
  [SymbolType]: 'string' | 'other'
  subsitution: StringSubsitution
  value: any
}
interface FirefoxAvaliableCSSStyleDeclaration {
  // Background
  background?: string
  'background-attachment'?: string
  'background-clip'?: string
  'background-color'?: string
  'background-image'?: string
  'background-origin'?: string
  'background-position'?: string
  'background-repeat'?: string
  'background-size'?: string

  // Border
  border?: string
  'border-width'?: string
  'border-style'?: string
  'border-color'?: string
  'border-top'?: string
  'border-right'?: string
  'border-bottom'?: string
  'border-left'?: string
  'border-top-width'?: string
  'border-top-style'?: string
  'border-top-color'?: string
  'border-right-width'?: string
  'border-right-style'?: string
  'border-right-color'?: string
  'border-bottom-width'?: string
  'border-bottom-style'?: string
  'border-bottom-color'?: string
  'border-left-width'?: string
  'border-left-style'?: string
  'border-left-color'?: string

  // Border Radius
  'border-radius'?: string

  // Box Decoration Break
  'box-decoration-break'?: string

  // Box Shadow
  'box-shadow'?: string

  // Clear & Float
  clear?: string
  float?: string

  // Color
  color?: string

  // Cursor
  cursor?: string

  // Display
  display?: string

  // Font
  font?: string
  'font-family'?: string
  'font-size'?: string
  'font-style'?: string
  'font-variant'?: string
  'font-weight'?: string
  'font-stretch'?: string

  // Line Height
  'line-height'?: string

  // Margin
  margin?: string
  'margin-top'?: string
  'margin-right'?: string
  'margin-bottom'?: string
  'margin-left'?: string

  // Outline
  outline?: string
  'outline-width'?: string
  'outline-style'?: string
  'outline-color'?: string

  // Padding
  padding?: string
  'padding-top'?: string
  'padding-right'?: string
  'padding-bottom'?: string
  'padding-left'?: string

  // Text Transform and Related StyleDeclaration
  'text-transform'?: string
  'text-align'?: string
  'text-decoration'?: string
  'text-indent'?: string
  'text-overflow'?: string

  // White Space
  'white-space'?: string

  // Word Spacing & Word Break
  'word-spacing'?: string
  'word-break'?: string

  // Writing Mode
  'writing-mode'?: string
}

export type OptionCSSStyleDeclaration =
  Partial<FirefoxAvaliableCSSStyleDeclaration>
