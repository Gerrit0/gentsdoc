/***
 * A module comment
 * @since 1.1
 */

/**
 * A const number
 * @see b
 */
export const a: number

/**
 * A let number
 */
export let b: number

/**
 * A var number
 */
// tslint:disable-next-line no-var-keyword
export var c: number

/**
 * A more complex type
 * @deprecated - Use a and b instead
 */
export declare const d: {
  a: number
  b: number
}

/**
 * A numeric literal
 */
export declare const e = 3.1415926

/**
 * Exported later
 */
declare const f = 'string'

export { f }
