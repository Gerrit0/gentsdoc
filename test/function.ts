/**
 * A module comment
 */

/**
 * A basic function
 * @param arg an argument
 */
export function a (arg: string): string {
  return arg
}

/**
 * A destructed function
 * @param param0 something
 * @param param0.arg documentation for arg
 * @param param0.n documentation for n
 */
export function b ({ arg, n }: { arg: string, n: number }): string {
  return arg.repeat(n)
}

/**
 * A function with an object argument
 * @param obj some obj
 * @param obj.arg some argument
 * @param obj.n some number
 */
export function c (obj: { arg: string, n: number }): string {
  return obj.arg.repeat(obj.n)
}

export interface Test {
  a: string
}

/**
 * A function with an interface arg
 * @param arg some argument
 */
export function d (arg: Test): string {
  return arg.a
}

/**
 * A function with a union argument
 * @param _unused some comment
 */
export function e (_unused: string | number): void {
  // Nothing
}

/**
 * A tuple destructuring parameter
 * @param param0.0 documentation for "a"
 * @param param0.1 documentation for "b"
 */
export function f ([a, b]: [string, number]): string {
  return a.repeat(b)
}

/**
 * A tuple within a tuple
 * @param param0.0.0 documentation for "a"
 * @param param0.1 documentation for "b"
 */
export function g ([[a], b]: [[string], number]): string {
  return a.repeat(b)
}

/**
 * An array destructuring parameter
 * @param param0 all that is supported. Can't use param0.0
 */
export function h ([a, ...b]: string[]): string {
  return b.join(a)
}

/**
 * Messy initialization
 * @param param0.a docs for a
 * @param param0.b docs for b
 * @param param0.b.c docs for c
 * @returns Math.pow(a, c)
 */
export function i ({ a = 1, b: { c = 2 } = {} }: { a?: number, b?: { c: number } } = {}): number {
  return a ** c
}

/**
 * Optional parameters
 * @param a docs for a
 */
export function j (a?: number): number {
  return a || 0
}

/**
 * More optional parameters
 */
export function k (a?: { b?: number }): number {
  return a ? a.b || 0 : 0
}

/**
 * Even more optional parameters
 */
export function l (a: { b?: number } = {}): number {
  return a.b || 0
}
