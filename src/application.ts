import * as ts from 'typescript'
import { Output } from './output/output'
import { Context } from './context'
import { GentsdocOptions } from './options'
import { Options } from './options/options'
import { ConsoleLogger, Logger } from './utils/logger'

export class Application {
  _program?: ts.Program
  _checker?: ts.TypeChecker

  options = new Options()
  output = new Output(this)
  logger: Logger = new ConsoleLogger()

  constructor (options: Partial<GentsdocOptions> = {}) {
    this.options.setOptions(options)
  }

  get program () {
    if (!this._program) {
      throw new Error('Application not initialized.')
    }
    return this._program
  }

  get checker () {
    if (!this._checker) {
      throw new Error('Application not initialized.')
    }
    return this._checker
  }

  generate (options: ts.CompilerOptions = {}) {
    this._program = ts.createProgram(this.options.getOption('entries'), options)
    this._checker = this.program.getTypeChecker()

    const toDocument: ts.Symbol[] = []

    for (const path of this.options.getOption('entries')) {
      const file = this.program.getSourceFile(path)
      if (!file) {
        this.logger.error(`The entry ${path} could not be found.`)
        continue
      }

      const rootSymbol = this.checker.getSymbolAtLocation(file)
      if (!rootSymbol) {
        this.logger.error(`The source file ${path} is not a module and will not be documented.`)
        continue
      }

      const fileExports = rootSymbol.exports
      if (fileExports) {
        fileExports.forEach(e => toDocument.push(e))
      }
    }

    const contexts = toDocument.map(s => new Context(this.checker, s))
    this.output.generate(contexts)
  }
}
