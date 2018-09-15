import { AbstractConverter } from '../converters/abstract'
import { Application } from '../application'
import { AbstractRenderer } from '../renderers/abstract'

export type ConverterClass = new (app: Application) => AbstractConverter
const converters: ConverterClass[] = []
const renderers: [string, new (app: Application) => AbstractRenderer][] = []

export function getConverters (app: Application) {
  return converters.map(c => new c(app))
}

/**
 * Adds the specified class to the converter list which will be used to convert symbols
 * @decorator
 * @param target
 */
export function Converter (target: ConverterClass) {
  converters.push(target)
}

const booleanOptions = new Map<string, OptionConfig & { value?: boolean }>()
const stringOptions = new Map<string, OptionConfig & { value?: string }>()

export interface OptionConfig {
  flag: string
  help: string
}

export function BooleanOption ({ flag, help }: OptionConfig): PropertyDecorator {
  if (stringOptions.has(flag) || booleanOptions.has(flag)) {
    throw new Error(`Option with flag ${flag} has already been declared.`)
  }

  booleanOptions.set(flag, { flag, help })

  return (target, key) => {
    Object.defineProperty(target, key, {
      get: () => booleanOptions.get(flag)!.value,
      set: (v: boolean) => booleanOptions.get(flag)!.value = v
    })
  }
}

export function StringOption ({ flag, help }: OptionConfig): PropertyDecorator {
  if (stringOptions.has(flag) || booleanOptions.has(flag)) {
    throw new Error(`Option with flag ${flag} has already been declared.`)
  }

  stringOptions.set(flag, { flag, help })

  return (target, key) => {
    Object.defineProperty(target, key, {
      get: () => stringOptions.get(flag)!.value,
      set: (v: string) => stringOptions.get(flag)!.value = v
    })
  }
}

export function Renderer (name: string): ClassDecorator {
  return (target: Function) => {
    if (!(target.prototype instanceof AbstractRenderer)) {
      throw new Error('Theme decorator can only be used on a class that inherits AbstractRenderer')
    }

    BooleanOption({
      flag: `render-${name}`,
      help: `Renders the project using the ${name} renderer`
    })
    renderers.push([name, target as new () => AbstractRenderer])
  }
}

export function initializeRenderers (app: Application): AbstractRenderer[] {
  return renderers.filter(([key]) => booleanOptions.get(`render-${key}`)!.value)
    .map(([ , renderer]) => {
      const r = new renderer(app)
      r.initialize()
      return r
    })
}

/**
 * Parses a string array of arguments, setting any registered arguments.
 * Returns any arguments which are not associated with an option.
 * @param argv
 */
export function parseArgv (argv: string[]): string[] {
  const extra: string[] = []

  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) {
      extra.push(argv[i])
      continue
    }

    const key = argv[i].substr(2)

    if (booleanOptions.has(key)) {
      booleanOptions.get(key)!.value = true
    } else if (stringOptions.has(key) && i < argv.length - 1) {
      stringOptions.get(key)!.value = argv[i + 1]
      i++
    } else {
      extra.push(argv[i])
    }
  }

  return extra
}

export function displayHelpAndExit (): never {
  const lines = [
    '',
    'Usage: gentsdoc path/to/entry/point.ts --render-minimal',
    '',
    ...[...booleanOptions.values()].map(option => `  --${option.flag} ${option.help}`),
    ...[...stringOptions.values()].map(option => `  --${option.flag} ${option.help}`),
    '',
    ''
  ]

  process.stdout.write(lines.join('\n'))

  return process.exit()
}
