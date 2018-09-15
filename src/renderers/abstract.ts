import { Application } from '../application'

export abstract class AbstractRenderer {
  constructor (public application: Application) {}

  abstract initialize (): void

  abstract render (): void
}
