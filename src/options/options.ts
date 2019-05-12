import { GentsdocOptions, GentsdocOptionsLax, AllowedOptionTypes } from '.'
import { Logger } from '../utils/logger'
import { addDefaultOptions } from './default'

export interface OptionDeclaration<K extends keyof GentsdocOptions = keyof GentsdocOptions> {
  name: K
  default: GentsdocOptions[K]
  help: string
}

export interface OptionReader {
  /**
   * Read may return extra properties when parsing user input or may throw an error. Declared options must be converted to the correct type.
   * @param declarations
   * @param logger
   */
  read (declarations: OptionDeclaration[], logger: Logger): GentsdocOptionsLax
}

export class Options {
  private optionMap: GentsdocOptionsLax = {}
  private options: OptionDeclaration[] = []
  private readers: Set<OptionReader> = new Set()

  constructor () {
    addDefaultOptions(this)
  }

  addReader (reader: OptionReader): void {
    this.readers.add(reader)
  }

  removeReader (reader: OptionReader): void {
    this.readers.delete(reader)
  }

  read (logger: Logger): void {
    for (const reader of this.readers) {
      const options = reader.read(this.options, logger)
      this.optionMap = { ...this.optionMap, ...options }
    }
  }

  declareOption (option: OptionDeclaration): void {
    if (this.options.some(d => d.name === option.name)) {
      throw new Error(`An option with name '${option.name}' already exists.`)
    }
    this.options.push(option)

    if (this.optionMap.hasOwnProperty(option.name)) {
      if (typeof option.default === 'string') {
        this.optionMap[option.name] = this.optionMap[option.name] + ''
      } else {
        this.optionMap[option.name] = !!this.optionMap[option.name]
      }
    }
  }

  isSet (name: keyof GentsdocOptions): boolean {
    return this.optionMap.hasOwnProperty(name)
  }

  getOption<K extends keyof GentsdocOptions> (name: K): GentsdocOptions[K] {
    const declaration = this.options.find(d => d.name === name)
    if (!declaration) {
      throw new Error(`The option '${name}' does not exist.`)
    }
    return this.optionMap.hasOwnProperty(name) ? this.optionMap[name]! : declaration.default
  }

  getOptionUnsafe (name: string): AllowedOptionTypes | undefined {
    return this.optionMap[name]
  }

  setOption<K extends keyof GentsdocOptions> (option: K, value: GentsdocOptions[K]): void
  setOption (option: string, value: AllowedOptionTypes): void
  setOption (option: string, value: AllowedOptionTypes) {
    this.optionMap[option] = value
  }

  setOptions (options: GentsdocOptionsLax) {
    this.optionMap = { ...this.optionMap, ...options }
  }

  getHelpOutput (): string {
    const maxNameLength = this.options.reduce((len, opt) => Math.max(len, opt.name.length), 0)

    return [
      'Usage: gentsdoc --entry src/index.ts',
      '',
      ...this.options.map(opt => ` --${opt.name.padEnd(maxNameLength)} ${opt.help}`)
    ].join('\n')
  }
}
