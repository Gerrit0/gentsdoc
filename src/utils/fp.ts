/**
 * Creates a new list from the provided lists.
 * If the provided lists differ in length, the result will be the length of the shortest list.
 * @param a
 */
export function zip<A> (a: A[]): [A][]
export function zip<A, B> (a: A[], b: B[]): [A, B][]
export function zip<A, B, C> (a: A[], b: B[], c: C[]): [A, B, C][]
export function zip (...arrays: unknown[][]): unknown[][] {
  const length = Math.min(...arrays.map(arr => arr.length))
  const result: unknown[][] = []
  for (let i = 0; i < length; i++) {
    result.push(arrays.map(arr => arr[i]))
  }
  return result
}

export type ConvertableToArray<T> = T | T[] | ArrayLike<T> | null | undefined

/**
 * Maps over a list and concatenates the results into a single list.
 * @param mapper
 * @param iterable
 */
export function chain<A, R> (mapper: (a: A) => ConvertableToArray<R>): (iterable: ReadonlyArray<A>) => ReadonlyArray<R>
export function chain<A, R> (mapper: (a: A) => ConvertableToArray<R>, iterable: ReadonlyArray<A>): ReadonlyArray<R>
export function chain<A, R> (mapper: (a: A) => ConvertableToArray<R>, iterable?: ReadonlyArray<A>):
  ReadonlyArray<R> | ((iterable: ReadonlyArray<A>) => ReadonlyArray<R>) {
  return iterable
    ? iterable.reduce<R[]>((result, item) => result.concat(toArray(mapper(item))), [])
    : iter => chain(mapper, iter)
}

function isArrayLike (a: { length?: any }): a is ArrayLike<any> {
  return typeof a.length === 'number'
}

/**
 * Converts the given value to an array.
 * @param a
 */
export function toArray<T> (a: ConvertableToArray<T>): ReadonlyArray<T> {
  return a == null
    ? []
    : Array.isArray(a)
    ? a
    : isArrayLike(a)
    ? Array.from(a)
    : [a]
}

/**
 * Flattens an array by one level.
 * @param a
 */
export function flatten<T> (a: T[][]): T[] {
  return a.reduce((r, i) => r.concat(i), [])
}
