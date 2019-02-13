import { Context } from '../context'
import { Application } from '../application'
import { Options } from '../options/options'

export interface OutputGenerator {
  /**
   * Returns true if {@link OutputGenerator.generate} should be called.
   */
  enabled (options: Options): boolean

  /**
   * Creates and writes output, will only be called if {@link OutputGenerator.enabled} returns true.
   * @param symbols
   */
  generate (app: Application, symbols: ReadonlyArray<Context>): void
}

/**
 * Keeps track of output types and which outputs are enabled.
 */
export class Output {
  private generators = new Set<OutputGenerator>()

  constructor (private app: Application) {}

  /**
   * Adds a generator that may create output.
   * @param generator
   */
  addGenerator (generator: OutputGenerator): void {
    this.generators.add(generator)
  }

  /**
   * Removes a generator, so that it will not be checked for output.
   * @param generator
   */
  removeGenerator (generator: OutputGenerator): void {
    this.generators.delete(generator)
  }

  /**
   * Gets all generators as an array.
   */
  getGenerators (): OutputGenerator[] {
    return [...this.generators]
  }

  /**
   * Returns true if at least one generator is enabled.
   */
  willCreateOutput (): boolean {
    return !!this.generators.size && [...this.generators].some(gen => gen.enabled(this.app.options))
  }

  /**
   * Creates output for all enabled generators.
   * @param symbols
   */
  generate (symbols: ReadonlyArray<Context>) {
    for (const gen of this.generators) {
      if (gen.enabled(this.app.options)) {
        gen.generate(this.app, symbols)
      }
    }
  }
}
