import { Option, OptionType, parseArgv, parseJsonOptionsFile, getOption, printHelpAndExit } from './helpers'
import { Application } from './application'

class CLI extends Application {
  @Option({
    flag: 'options',
    help: 'Specify a JSON options file.',
    default: '',
    type: OptionType.string
  })
  project: string

  @Option({
    flag: 'stdout',
    help: 'Output the JSON-stringified output to standard out, useful for debugging.',
    default: false,
    type: OptionType.boolean
  })
  stdout: boolean

  constructor () {
    super()
    parseArgv(process.argv.slice(2))
    if (this.project) {
      parseJsonOptionsFile(this.project)
      // File options should not override cli arguments, so parse argv again.
      parseArgv(process.argv.slice(2))
    }

    if (getOption<boolean>('help')) printHelpAndExit()
  }

  run (): void {
    try {
      const docs = this.documentFiles()

      if (this.stdout) console.log(JSON.stringify(docs, null, 2))
    } catch (error) {
      console.error('Failed to document files:', error)
    }
  }
}

const app = new CLI()
app.run()
