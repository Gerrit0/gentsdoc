import { Option, OptionType, parseArgv, parseJsonOptionsFile, getOption, printHelpAndExit, warn } from './helpers'
import { Application } from './application'

class CLI extends Application {
  @Option({
    flag: 'options',
    help: 'Specify a JSON options file.',
    default: '',
    type: OptionType.string
  })
  project !: string

  @Option({
    flag: 'stdout',
    help: 'Output the JSON-stringified output to standard out, useful for debugging.',
    default: false,
    type: OptionType.boolean
  })
  stdout !: boolean

  constructor () {
    super()
    // Parse arguments to get plugins to load, ignore errors as plugins may define options.
    parseArgv(process.argv.slice(2))
    if (this.project) parseJsonOptionsFile(this.project)

    if (getOption<boolean>('help')) printHelpAndExit()

    // Clear options and parse again, this time showing errors as plugins have loaded
    const warnings = parseArgv(process.argv.slice(2))

    if (this.project) warnings.push(...parseJsonOptionsFile(this.project))

    warnings.forEach(warning => warn(warning.message))
  }

  run (): void {
    try {
      const docs = this.documentFiles()

      if (!this.stdout) warn('No output method specified.')
      if (this.stdout) console.log(JSON.stringify(docs, null, 2))
    } catch (error) {
      console.error('Failed to document files:', error)
    }
  }
}

const app = new CLI()
app.run()
