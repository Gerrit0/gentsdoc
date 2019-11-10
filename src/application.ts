import * as ts from 'typescript'
import { Output } from './output/output'
import { Context } from './context'
import { GentsdocOptionsLax } from './options'
import { Options } from './options/options'
import { TSDocParser } from '@microsoft/tsdoc'
import { Logger } from './utils/logger';

export class Application {
  private _program?: ts.Program
  private _checker?: ts.TypeChecker

  options = new Options()
  output = new Output(this)

  constructor (options: GentsdocOptionsLax = {}) {
    this.options.setOptions(options)
  }

  /**
   * Only available once {@link Application.generate} has been called.
   */
  get program () {
    if (!this._program) {
      throw new Error('Application not initialized.')
    }
    return this._program
  }

  /**
   * Only available once {@link Application.generate} has been called.
   */
  get checker () {
    if (!this._checker) {
      throw new Error('Application not initialized.')
    }
    return this._checker
  }

  /**
   * Generates documentation for the library.
   * @param options
   */
  async generate (options: ts.CompilerOptions = {}): Promise<void> {
    const path = this.options.getOption('entry')
    this._program = ts.createProgram([path], options)
    this._checker = this.program.getTypeChecker()

    const file = this.program.getSourceFile(path)
    if (!file) {
      Logger.error(`The entry ${path} could not be found.`)
      return
    }

    const rootSymbol = this.checker.getSymbolAtLocation(file)
    if (!rootSymbol) {
      Logger.error(`The source file ${path} is not a module and will not be documented.`)
      return
    }

    const toDocument: ts.Symbol[] = []
    const fileExports = rootSymbol.exports
    if (fileExports) {
      fileExports.forEach(e => toDocument.push(e))
    }

    const contexts = toDocument.map(s => new Context(this.checker, s, new TSDocParser()))
    return this.output.generate(contexts)
  }
}
