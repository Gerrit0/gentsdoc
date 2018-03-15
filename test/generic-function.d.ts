/***
 * Functions signatures copied from the Typescript documentation.
 * @see http://www.typescriptlang.org/docs/handbook/generics.html
 */

/**
 * The identity function
 */
export function identity<T> (arg: T): T

export interface Lengthwise {
  length: number
}

/**
 * Generic extends
 * @param T the generic argument
 */
export function loggingIdentity<T extends Lengthwise> (arg: T): T

/**
 * keyof
 */
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]

export interface Animal {}

/**
 * Create an animal
 */
export function createInstance<A extends Animal>(c: new () => A): A

/**
 * A defaulted generic type
 */
export function withInit<A = string>(): A
