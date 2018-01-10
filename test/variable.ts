/**
 * A const number
 * @see b
 */
export const a: number = 1

/**
 * A let number
 */
export let b = 2

/**
 * A var number
 */
// tslint:disable-next-line no-var-keyword
export var c = 3

/**
 * A more complex type
 * @deprecated - Use a and b instead
 */
export const d = {
  a: 1,
  b: 2
}

/**
 * Exported later
 */
const e = 'string'

export { e }

/**
 * Type only
 */
export let f: number

/**
 * A function
 */
export const g = (a: string) => a
