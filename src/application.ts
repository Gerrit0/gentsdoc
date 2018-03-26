import { EventEmitter } from 'events'
import { uniq } from 'lodash'
import Project, { ExportableNode, Node, SourceFile, Symbol } from 'ts-simple-ast'
import { Option, OptionType, findFiles, makeMinimatch, warn } from './helpers'

export enum AppEventNames {
  fileStart = 'fileStart',
  fileEnd = 'fileEnd',
  function = 'function',
  enum = 'enum',
  alias = 'alias',
  interface = 'interface',
  done = 'done'
}

interface ApplicationEvents {
  /**
   * Fires just before a file's members are parsed.
   */
  [AppEventNames.fileStart]: SourceFile,
  /**
   * Fires after a file's members have been parsed.
   */
  [AppEventNames.fileEnd]: SourceFile
  /**
   * Fires when an exported function is found.
   */
  [AppEventNames.function]: Symbol
  /**
   * Fires when an exported enumeration is found.
   */
  [AppEventNames.enum]: Symbol
  /**
   * Fires when an exported type alias is found.
   */
  [AppEventNames.alias]: Symbol
  /**
   * Fires when an exported type alias is found.
   */
  [AppEventNames.interface]: Symbol
  /**
   * Fires after all files have been documented.
   */
  [AppEventNames.done]: Application
}

export class Application extends EventEmitter {
  @Option({
    flag: 'include',
    help: 'Specify files to be included. By default, all declaration files will be included.',
    default: ['**/*.d.ts'],
    type: OptionType.stringArray
  })
  include !: string []

  @Option({
    flag: 'exclude',
    help: 'Specify files to be excluded from the output. Defaults to excluding node_modules, .git, and .spec.d.ts and .test.d.ts files.',
    default: ['**/*.{spec,test}.d.ts', 'node_modules', '.git'],
    type: OptionType.stringArray
  })
  exclude !: string []

  @Option({
    flag: 'plugin',
    help: 'Add a plugin to be loaded when parsing.',
    default: [],
    type: OptionType.stringArray
  })
  plugins !: string[]

  documentFiles (root: string = '.'): void {
    const files = findFiles(this.include, this.exclude, root)
    const project = new Project()
    files.forEach(file => project.addSourceFileIfExists(file))

    project.getSourceFiles()
      .filter(this.shouldDocument, this)
      .forEach(this.documentFile, this)

    this.emit(AppEventNames.done, this)
  }

  documentFile (file: SourceFile): void {
    this.emit(AppEventNames.fileStart, file)

    const getExportSymbols = (nodes: Array<Node & ExportableNode>) => {
      // Exported nodes should always have a symbol.
      const symbols = nodes.filter(node => node.isExported()).map(node => node.getSymbolOrThrow())
      return uniq(symbols)
    }

    getExportSymbols(file.getFunctions())
      .forEach(s => this.emit(AppEventNames.function, s))
    getExportSymbols(file.getEnums())
      .forEach(s => this.emit(AppEventNames.enum, s))
    getExportSymbols(file.getTypeAliases())
      .forEach(s => this.emit(AppEventNames.alias, s))
    getExportSymbols(file.getInterfaces())
      .forEach(s => this.emit(AppEventNames.interface, s))

    this.emit(AppEventNames.fileEnd, file)
  }

  on<K extends keyof ApplicationEvents> (event: K, listener: (file: ApplicationEvents[K]) => void) {
    return super.on(event, listener)
  }

  off<K extends keyof ApplicationEvents> (event: K, listener: (file: ApplicationEvents[K]) => void) {
    return super.removeListener(event, listener)
  }

  emit<K extends keyof ApplicationEvents> (event: K, argument: ApplicationEvents[K]) {
    return super.emit(event, argument)
  }

  protected shouldDocument (file: SourceFile): boolean {
    const relativeFile = file.getFilePath().replace(process.cwd().replace(/\\/g, '/') + '/', '')

    const includePatterns = this.include.map(makeMinimatch)
    const excludePatterns = this.exclude.map(makeMinimatch)

    return [
      includePatterns.some(pattern => pattern.match(relativeFile)),
      excludePatterns.every(pattern => !pattern.match(relativeFile)),
      file.isDeclarationFile
    ].every(Boolean)
  }

  protected loadPlugins (): void {
    this.plugins.forEach(id => {
      const plugin = require(id)
      if (plugin.initialize) {
        plugin.initialize(this)
      } else {
        warn(`Plugin ${id} did not specify an initialize function.`)
      }
    })
  }
}
