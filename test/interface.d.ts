/***
 * Interfaces taken from the Typescript docs, annotated with custom comments
 * @see http://www.typescriptlang.org/docs/handbook/interfaces.html
 */

/**
 * Has a label
 */
export interface LabelledValue {
  /**
   * The label
   */
  label: string
}

/**
 * Generally better to use another interface.
 */
export interface UsingPropertyTags {
  /**
   * A prop
   * @property x something
   * @prop y something else
   */
  prop: {
    x: number
    y?: string
  }
}

/**
 * Optional properties
 */
export interface SquareConfig {
  /**
   * Maybe a string
   */
  color?: string
  /**
   * Maybe a number
   */
  width?: number
}

/**
 * Introduces readonly properties
 */
export interface Point {
  readonly x: number
  readonly y: number
}

/**
 * Indexed properties
 */
export interface StringArray {
  [indexName: number]: string
}

/**
 * Methods
 */
export interface ClockInterface {
  currentTime: Date
  /**
   * A method
   * @param d some date
   */
  setTime(d: Date): void
}

/**
 * Constructor
 */
export interface ClockConstructor {
  /**
   * @param hour the hour
   * @param minute the minute
   */
  new(hour: number, minute: number): ClockInterface
}

/**
 * Extended interface
 */
export interface Shape {
  /**
   * To be inherited.
   */
  color: string
}

/**
 * Extended interface
 */
export interface Shape2 {
  colour: string
}

/**
 * Extends shape
 */
export interface Square extends Shape, Shape2 {
  /**
   * A property
   */
  sideLength: number
}

/**
 * Hybrid types
 */
export interface Counter {
  /**
   * A signature
   */
  (start: number): string
  /**
   * A number
   */
  interval: number
  /**
   * A method
   */
  reset(): void
}

/*
 * Custom interfaces
 */

export interface Merged {
  a: string
}
export interface Merged {
  b: number
}

export interface Merged {
  /**
   * A call signature
   * @returns a string
   */
  (a: string): string
}
export interface Merged {
  /**
   * Another comment
   * @param a some number
   */
  (a: number): number
}

export interface Merged {
  test(): void
}
export interface Merged {
  test(a: string): string
}

/**
 * Methods defined as properties
 */
export interface PropertyMethods {
  a: () => void
  /**
   * @param a a string
   */
  b: (a: string) => string
}
