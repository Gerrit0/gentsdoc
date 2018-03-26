import { Application } from './application'
import { Option, OptionType, getOption, parseArgv, parseJsonOptionsFile, printHelpAndExit, warn } from './helpers'

class CLI extends Application {
  @Option({
    flag: 'options',
    help: 'Specify a JSON options file.',
    default: '',
    type: OptionType.string
  })
  project !: string

  @Option({
    flag: 'json',
    help: 'Create a JSON schema of the documented files.',
    default: false,
    type: OptionType.boolean
  })
  json !: boolean

  constructor () {
    super()
    // Parse arguments to get plugins to load, ignore errors as plugins may define options.
    parseArgv(process.argv.slice(2))
    if (this.project) parseJsonOptionsFile(this.project)

    if (getOption<boolean>('help')) printHelpAndExit()

    if (this.json) this.plugins.push(`${__dirname}/json`)
    this.loadPlugins()

    // Clear options and parse again, this time showing errors as plugins have loaded
    const warnings = parseArgv(process.argv.slice(2))

    if (this.project) warnings.push(...parseJsonOptionsFile(this.project))

    warnings.forEach(warning => warn(warning.message))
  }

  run (): void {
    try {
      this.documentFiles()
    } catch (error) {
      console.error('Failed to document files:', error)
    }
  }
}

const app = new CLI()
app.run()
