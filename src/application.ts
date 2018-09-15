import * as tsdoc from '@microsoft/tsdoc'
import { readFileSync } from 'fs'
import * as ts from 'typescript'
import { AbstractConverter, EnumReflection } from './converters'
import { BooleanOption, ConsoleLogger, displayHelpAndExit, EventEmitter, getCommentRange, getConverters, initializeRenderers, Logger, StringOption } from './utils'

interface ApplicationEvents {
  start: [],
  enum: [EnumReflection],
  done: [],
}

export class Application extends EventEmitter<ApplicationEvents> {
  readonly logger: Logger = new ConsoleLogger()
  program!: ts.Program
  checker!: ts.TypeChecker

  private converters!: AbstractConverter[]
  private parser!: tsdoc.TSDocParser

  @BooleanOption({
    flag: 'help',
    help: 'Display this help message.'
  })
  help = false

  @StringOption({
    flag: 'project',
    help: 'Path to the tsconfig.json file for this project'
  })
  project = 'tsconfig.json'

  run (argv: string[], tsdocOptions?: tsdoc.TSDocParserConfiguration): void {
    if (this.help) {
      displayHelpAndExit()
    }

    this.converters = getConverters(this)
    this.parser = new tsdoc.TSDocParser(tsdocOptions)
    const entries = this.getEntryPoints(argv)

    const options: ts.CompilerOptions = ts.readConfigFile('tsconfig.json', path => readFileSync(path, 'utf-8')).config
    const program = this.program = ts.createProgram(entries, options)
    const checker = this.checker = program.getTypeChecker()

    const renderers = initializeRenderers(this)
    if (renderers.length < 1) {
      this.logger.warn('No renderers have been initialized. No documentation will be generated.')
    }

    this.emit('start')
    for (const file of entries) {
      const sourceFile = program.getSourceFile(file)
      if (!sourceFile) {
        this.logger.error(`Unable to find source file for ${file}`)
        continue
      }
      const symbol = checker.getSymbolAtLocation(sourceFile)
      if (!symbol) {
        this.logger.error(`Source file ${file} is not a module`)
        continue
      }

      if (!symbol.exports) {
        this.logger.warn(`Module ${file} has no exports`)
        continue
      }

      symbol.exports.forEach(s => {
        // Most of the time there will only be one converter, however there may
        // be multiple due to declaration merging of different declaration types.
        const converters = this.converters.filter(c => c.supports(s))
        if (converters.length === 0) {
          this.logger.warn(`No converters found to convert symbol ${s.name}`)
        }
        converters.forEach(c => c.convert(s))
      })
    }
    this.emit('done')
    renderers.forEach(r => r.render())
  }

  getDocComment (declarations: ReadonlyArray<ts.Declaration> | ts.Declaration) {
    return this.parseCommentRange(getCommentRange(declarations))
  }

  parseCommentRange (range?: tsdoc.TextRange): tsdoc.DocComment | undefined {
    return range && this.parser.parseRange(range).docComment
  }

  private getEntryPoints (argv: string[]): string[] {
    return argv.filter(entry => {
      if (entry.startsWith('--')) {
        this.logger.warn(`Unrecognized option: ${entry}`)
        return false
      }
      return true
    })
  }
}
