/***
 * Class declarations mostly copied from the Typescript docs
 * @see https://www.typescriptlang.org/docs/handbook/classes.html
 */

/**
 * A basic class.
 */
export class Greeter {
  greeting: string
  /**
   *
   * @param message some greeting
   */
  constructor(message: string)
  greet(): string
  greet(name: string): string
}

export class Animal {
  /**
   * Property method
   * @param distanceInMeters some distance
   */
  move: (distanceInMeters: number) => void
}

interface Barks {
  bark(): void
}

/**
 * Extends
 */
export class Dog extends Animal implements Barks {
  bark(): void
}

/**
 * Visibility modifiers
 */
export class Person {
  protected name: string
  constructor(name: string)
}

export class Employee extends Person {
  private department: string

  constructor(name: string, department: string)

  public getElevatorPitch(): string
}

export class Octopus {
  readonly name: string
  readonly numberOfLegs: number
  constructor(theName: string)
}

/**
 * A generic class.
 * @param T the generic type
 */
export class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

export class StaticStuff {
  static a: string
  static b(): void
  protected static c(): void
  private static d(): void
  static e: () => void
  private constructor()
}

export abstract class Abstracted {
  abstract a: string
  abstract b(): void
  c(): string
}
