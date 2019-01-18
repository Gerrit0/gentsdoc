import { GentsdocOptions } from '.'
import { Logger } from '../utils/logger'
import { addDefaultOptions } from './default'

interface OptionDeclaration<K extends keyof GentsdocOptions = keyof GentsdocOptions> {
  name: K
  default: GentsdocOptions[K]
  help: string
}

interface OptionReader {
  read (declarations: OptionDeclaration[], logger: Logger): Partial<GentsdocOptions>
}

export class Options {
  private optionMap: Partial<GentsdocOptions> = {}
  private options: OptionDeclaration[] = []
  private readers: OptionReader[] = []

  constructor () {
    addDefaultOptions(this)
  }

  addReader (reader: OptionReader): void {
    if (!this.readers.includes(reader)) {
      this.readers.push(reader)
    }
  }

  removeReader (reader: OptionReader): void {
    const index = this.readers.indexOf(reader)
    if (index !== -1) {
      this.readers.splice(index, 1)
    }
  }

  read (logger: Logger): void {
    for (const reader of this.readers) {
      const options = reader.read(this.options, logger)
      this.optionMap = { ...this.optionMap, ...options }
    }
  }

  declareOption (option: OptionDeclaration): void {
    const declaration = this.options.find(d => d.name === option.name)
    if (declaration) {
      throw new Error(`An option with name '${option.name}' already exists.`)
    }
    this.options.push(option)
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

  setOption<K extends keyof GentsdocOptions> (option: K, value: GentsdocOptions[K]): void {
    this.optionMap[option] = value
  }

  setOptions (options: Partial<GentsdocOptions>) {
    this.optionMap = { ...this.optionMap, ...options }
  }

  getHelpOutput (): string {
    return [
      'Usage: gentsdoc ./src',
      '',
      ...this.options.map(opt => `  --${opt.name} ${opt.help}`)
    ].join('\n')
  }
}
