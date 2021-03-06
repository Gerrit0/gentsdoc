import { EventEmitter } from 'events'
import { writeFileSync } from 'fs-extra'
import { resolve } from 'path'
import { AppEventNames, Application } from '../application'
import { Option, OptionType, warn } from '../helpers'
import { FileDocNode } from './schema'
import { convertAlias } from './alias'
import { convertClass } from './class'
import { convertEnum } from './enum'
import { getFileDoc } from './file'
import { convertFunction } from './function'
import { convertInterface } from './interface'
import { convertVariable } from './variable'
import { TypeGuards } from 'ts-simple-ast'

interface JSONPluginEvents {
  fileComplete: FileDocNode
}

export class JSONPlugin extends EventEmitter {
  @Option({
    flag: 'json.stdout',
    help: 'Prints the JSON-stringified output to stdout, useful for debugging.',
    type: OptionType.boolean,
    default: false
  })
  stdout !: boolean

  @Option({
    flag: 'json.out',
    help: 'Specify a location to write out the JSON file.',
    type: OptionType.string,
    default: ''
  })
  out !: string

  files: FileDocNode[] = []
  private file !: FileDocNode

  constructor (app: Application) {
    super()

    app.on(AppEventNames.fileStart, sourceFile => {
      this.file = getFileDoc(sourceFile)
    })

    app.on(AppEventNames.fileEnd, () => {
      this.files.push(this.file)
      this.emit('fileComplete', this.file)
    })

    app.on(AppEventNames.function, symbol => {
      this.file.functions.push(convertFunction(symbol))
    })

    app.on(AppEventNames.enum, symbol => {
      this.file.enumerations.push(convertEnum(symbol))
    })

    app.on(AppEventNames.alias, symbol => {
      this.file.types.push(convertAlias(symbol))
    })

    app.on(AppEventNames.interface, symbol => {
      this.file.interfaces.push(convertInterface(symbol))
    })

    app.on(AppEventNames.class, symbol => {
      this.file.classes.push(convertClass(symbol))
    })

    app.on(AppEventNames.variable, symbol => {
      const declaration = symbol.getDeclarations().find(TypeGuards.isVariableDeclaration)!
      const typeNode = declaration.getTypeNode()
      if (typeNode && TypeGuards.isFunctionTypeNode(typeNode)) {
        this.file.functions.push(convertFunction(symbol))
      } else {
        this.file.variables.push(convertVariable(symbol))
      }
    })
  }

  on<T extends keyof JSONPluginEvents> (event: T, listener: (arg0: JSONPluginEvents[T]) => void) {
    return super.on(event, listener)
  }

  off<T extends keyof JSONPluginEvents> (event: T, listener: (arg0: JSONPluginEvents[T]) => void) {
    return super.removeListener(event, listener)
  }

  emit<T extends keyof JSONPluginEvents> (event: T, arg0: JSONPluginEvents[T]) {
    return super.emit(event, arg0)
  }
}

export function initialize (app: Application) {
  const plugin = new JSONPlugin(app)

  app.on(AppEventNames.done, () => {
    const stringified = JSON.stringify(plugin.files, undefined, 2)
    if (!plugin.stdout && !plugin.out) {
      warn('JSON Plugin: No output method. Specify --json.stdout or --json.out.')
    }
    if (plugin.stdout) {
      console.log(stringified)
    }
    if (plugin.out) {
      const path = resolve(plugin.out)
      writeFileSync(path, stringified, { encoding: 'utf-8' })
      console.log('Wrote JSON to', path)
    }
  })
}
