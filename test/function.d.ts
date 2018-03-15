/***
 * A module comment
 */

/**
 * A basic function
 * @param arg an argument
 */
export declare function a(arg: string): string;

/**
 * A destructed function
 * @param param0 something
 * @param param0.arg documentation for arg
 * @param param0.n documentation for n
 */
export declare function b({ arg, n }: {
  arg: string;
  n: number;
}): string;

/**
 * A function with an object argument
 * @param obj some obj
 * @param obj.arg some argument
 * @param obj.n some number
 */
export declare function c(obj: {
  arg: string;
  n: number;
}): string;

export interface Test {
  a: string;
}

/**
 * A function with an interface arg
 * @param arg some argument
 */
export declare function d(arg: Test): string;

/**
 * A function with a union argument
 * @param _unused some comment
 */
export declare function e(_unused: string | number): void;

/**
 * A tuple destructuring parameter
 * @param param0.0 documentation for "a"
 * @param param0.1 documentation for "b"
 */
export declare function f([a, b]: [string, number]): string;

/**
 * A tuple within a tuple
 * @param param0.0.0 documentation for "a"
 * @param param0.1 documentation for "b"
 */
export declare function g([[a], b]: [[string], number]): string;

/**
 * An array destructuring parameter
 * @param param0 all that is supported. Can't use param0.0
 */
export declare function h([a, ...b]: string[]): string;

/**
 * Messy destructuring
 * @param param0.a docs for a
 * @param param0.b docs for b
 * @param param0.b.c docs for c
 * @returns Math.pow(a, c)
 */
export declare function i({ a, b: { c } }?: {
  a?: number;
  b?: {
    c?: number;
  };
}): number;

/**
 * Optional parameters
 * @param a docs for a
 */
export declare function j(a?: number): number;

/**
 * Intersections and unions
 */
export declare function k(a?: { a: string } & { b: string }): string | number | void;

/**
 * A rest parameter
 * @param a should have rest: true
 */
export declare function l(...a: number[]): string;

/**
 * Rest within an object + multiple signatures
 * @param param0.a a number
 * @param param0.b should not be used as we care about types, not what things are named
 * @param param0.c a string
 */
export declare function m({ a, ...b }: { a: number, c: string }): string;

/**
 * A messy array + multiple signatures
 * @param a all that can be used for now.
 */
export declare function m(a: { b: number, c: string }[]): string;
