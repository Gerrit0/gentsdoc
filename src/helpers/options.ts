import { repeat, flatten, padEnd, size, flow } from 'lodash'
import { readJsonSync } from './fs'
import { existsSync } from 'fs'

export const enum OptionType {
  string = 'string',
  stringArray = 'string[]',
  number = 'number',
  boolean = 'boolean'
}

export interface BaseOption {
  flag: string
  short?: string
  help: string
}

export interface BooleanOption extends BaseOption {
  type: OptionType.boolean
  default: boolean
}

export interface StringOption extends BaseOption {
  type: OptionType.string
  default: string
}

export interface NumberOption extends BaseOption {
  type: OptionType.number
  default: number
}

export interface StringArrayOption extends BaseOption {
  type: OptionType.stringArray
  default: string[]
}

/**
 * An option declaration that can be formatted to generate a help menu.
 */
export type OptionConfig = BooleanOption | StringOption | NumberOption | StringArrayOption

const options = new Map<string, OptionConfig & { value?: any }>([
  ['help', {
    flag: 'help',
    short: 'h',
    help: 'Display this help message.',
    type: OptionType.boolean,
    default: false
  }]
])

/**
 * Gets an option, throwing if an invalid flag was specified.
 * @param flag the option flag to get
 */
export function getOption<T extends string | ReadonlyArray<string> | number | boolean> (flag: string): T {
  const opt = options.get(flag)
  if (!opt) throw new Error(`Invalid option flag: ${flag}`)
  return 'value' in opt ? opt.value : opt.default
}

/**
 * Sets an option, for use with testing.
 */
export function setOption (flag: string, value: string | ReadonlyArray<string> | number | boolean): void {
  const opt = options.get(flag)
  if (!opt) throw new Error(`Invalid option flag: ${flag}`)
  if (typeof opt.default !== typeof value) throw new Error(`Mismatching type, expected ${opt.type}`)
  opt.value = value
}

/**
 * Declares an option
 * @param config
 */
export function addOption (config: OptionConfig): void {
  options.set(config.flag, config)
}

/**
 * Clears all the set values for options
 */
export function clearOptions (): void {
  for (const option of options.values()) {
    delete option.value
  }
}

export function Option (config: OptionConfig): PropertyDecorator {
  options.set(config.flag, config)

  return (target: Object, key: string | symbol) => {
    Object.defineProperty(target, key, {
      get: () => getOption(config.flag),
      set: (value: any) => options.get(config.flag)!.value = value,
      enumerable: true,
      configurable: true
    })
  }
}

/**
 * Helper function to print the help page.
 */
export function printHelpAndExit (): never {
  function getLines (str: string, padding = 0): string[] {
    const maxLineLength = process.stdout.columns || Infinity
    if (padding > maxLineLength) padding = 0
    if (str.length < maxLineLength) return [str]

    let lineLength = str.lastIndexOf(' ', maxLineLength)
    if (lineLength === -1) lineLength = Infinity

    return [
      str.substr(0, lineLength),
      ...getLines(repeat(' ', padding) + str.substr(lineLength + 1), padding)
    ]
  }

  const getHeader = (opt: OptionConfig) => opt.short ? `--${opt.flag}, -${opt.short}` : `--${opt.flag}`

  const maxLength = Math.max(flow([getHeader, size])([...options.values()])) + 3

  const lines = [...options.values()]
    .map(opt => getLines(`${padEnd(getHeader(opt), maxLength)}${opt.help}`, maxLength))

  process.stdout.write([
    '',
    'Usage: gentsdoc --include "*.ts"',
    '',
    'Options:',
    ...flatten(lines),
    ''
  ].join('\n'))

  return process.exit()
}

export interface OptionDiagnostic {
  key: string
  message: string
}

/**
 * Parses a list of arguments and injects them into the options map.
 * @param argv the array of command line arguments
 * @returns an array of warnings, empty if all arguments were of the correct type.
 */
export function parseArgv (argv: string[]): OptionDiagnostic[] {
  const warnings: OptionDiagnostic[] = []

  for (let i = 0; i < argv.length; i++) {
    const option = options.get(argv[i].slice(2))

    if (!option) {
      warnings.push({ key: argv[i], message: `Unknown option: ${argv[i]}` })
      continue
    }

    switch (option.type) {
      case OptionType.boolean:
        option.value = true
        break
      case OptionType.number:
        option.value = parseInt(argv[++i], 10)
        if (Number.isNaN(option.value)) delete option.value
        break
      case OptionType.string:
        option.value = argv[++i]
        break
      case OptionType.stringArray:
        option.value = Array.isArray(option.value) ? option.value.concat(argv[++i]) : [argv[++i]]
    }
  }

  return warnings
}

/**
 * Parses a JSON file and injects the value into the options map.
 * @param file the file to parse and inject
 */
export function parseJsonOptionsFile (file: string): OptionDiagnostic[] {
  if (!existsSync(file)) {
    throw new Error('Options file does not exist.')
  }

  const warnings: OptionDiagnostic[] = []

  try {
    const json = readJsonSync(file)
    for (const [flag, value] of Object.entries(json)) {
      const option = options.get(flag)
      if (!option) {
        warnings.push({ key: flag, message: `Unknown option: ${flag}` })
        continue
      }

      if ([
        option.type === OptionType.string && typeof value === 'string',
        option.type === OptionType.number && typeof value === 'number',
        option.type === OptionType.boolean && typeof value === 'boolean',
        option.type === OptionType.stringArray && Array.isArray(value) && value.every(v => typeof v === 'string')
      ].some(Boolean)) option.value = value
      else warnings.push({ key: flag, message: `Invalid type for ${flag}` })
    }
  } catch (error) {
    return [{ key: 'file', message: 'Unable to parse options file.' }]
  }

  return warnings
}
