/**
 * A basic type
 */
export type a = number

/**
 * A union type
 */
export type b = number | string

/**
 * Another union
 */
export type c = a | string

/**
 * A function to be used with typeof
 */
export function d (a: string): string

/**
 * Typeof, cannot use @param.
 */
export type e = typeof d

/**
 * Function declaration
 * @param a some string
 */
export type e2 = (a: string) => string

/**
 * An object
 * @prop a something
 */
export type f = { a: number }

// Interfaces should be used instead, but just in case...

/**
 * Another object
 * @property b some number
 */
export type g = { b: number }

/**
 * An intersection type
 */
export type h = f & g

/**
 * A tuple type
 */
export type i = [number, string]

/**
 * Another tuple type
 * @property 0 some prop
 * @property 1 some other element
 * @prop 2.a a boolean
 */
export type j = [number, g, { a: boolean }]
