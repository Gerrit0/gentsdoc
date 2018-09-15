/**
 * Simple, type safe, event emitter class.
 *
 * @example
 * ```ts
 * const x = new EventEmitter<{ a: [string] }>()
 * x.on('a', a => a.repeat(123)) // ok
 * x.on('b', console.log) // error, 'b' is not assignable to 'a'
 * const y = new EventEmitter<{ a: [string]; [k: string]: unknown[] }>()
 * y.on('a', a => a.repeat(123)) // ok
 * y.on('b', (...args: unknown[]) => console.log(...args)) // ok, any unknown events will contain an unknown number of arguments.
 * ```
 */
export class EventEmitter<T extends { [k in KAll]: any[] }, KAll extends keyof T = keyof T> {
  listeners: Map<KAll, ((...args: T[KAll]) => void)[]> = new Map()

  /**
   * Starts listening to an event.
   * @param event the event to listen to.
   * @param listener function to be called when an this event is emitted.
   */
  on<K extends KAll> (event: K, listener: (...args: T[K]) => void): void {
    const list = (this.listeners.get(event) || []).slice()
    list.push(listener)
    this.listeners.set(event, list)
  }

  /**
   * Stops listening to an event.
   * @param event the event to stop listening to.
   * @param listener the function to remove from the listener array.
   */
  off<K extends KAll> (event: K, listener: (...args: T[K]) => void): void {
    const list = this.listeners.get(event) || []
    const index = list.indexOf(listener)
    if (index !== -1) {
      list.splice(index, 1)
    }
  }

  /**
   * Emits an event to all currently subscribed listeners.
   * @param event the event to emit.
   * @param args any arguments required for the event.
   */
  emit<K extends KAll> (event: K, ...args: T[K]) {
    for (const listener of this.listeners.get(event) || []) {
      listener(...args)
    }
  }
}
