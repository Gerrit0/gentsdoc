/**
 * Basic enum
 */
export enum A {
  a,
  b
}

/**
 * With values
 * @remarks
 * Also links to {@link A} and {@link A.a}
 */
export const enum B {
  a = 4,
  b
}

/**
 * With string values
 */
export enum C {
  a = 'a',
  b = 'b'
}
