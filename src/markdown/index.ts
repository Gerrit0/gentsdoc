import { EventEmitter } from 'events'
import { writeFileSync } from 'fs-extra'
import { resolve, basename } from 'path'
import { AppEventNames, Application } from '../application'
import { Option, OptionType, getFileComment, stringifyTags, ensureDir } from '../helpers'
import { MarkdownBuilder } from './builder'
import { convertEnum } from './enum'
import { convertFunction } from './function'

interface MarkdownPluginEvents {
  fileComplete: MarkdownBuilder
}

export class MarkdownPlugin extends EventEmitter {
  @Option({
    flag: 'md.stdout',
    help: 'Prints the markdown output for each file to stdout, useful for debugging.',
    type: OptionType.boolean,
    default: false
  })
  stdout !: boolean

  @Option({
    flag: 'md.dir',
    help: 'Specify a directory to write out documentation files.',
    type: OptionType.string,
    default: ''
  })
  dir !: string

  builder !: MarkdownBuilder

  constructor (app: Application) {
    super()

    app.on(AppEventNames.fileStart, file => {
      this.builder = new MarkdownBuilder(file.getFilePath())
      const { comment, tags } = getFileComment(file)
      this.builder.paragraph(comment)
      this.builder.paragraph(stringifyTags(tags))
    })

    app.on(AppEventNames.enum, symbol => convertEnum(symbol, this.builder))

    app.on(AppEventNames.function, symbol => convertFunction(symbol, this.builder))

    app.on(AppEventNames.fileEnd, () => {
      this.emit('fileComplete', this.builder)
    })
  }

  on<T extends keyof MarkdownPluginEvents> (event: T, listener: (arg0: MarkdownPluginEvents[T]) => void) {
    return super.on(event, listener)
  }

  off<T extends keyof MarkdownPluginEvents> (event: T, listener: (arg0: MarkdownPluginEvents[T]) => void) {
    return super.removeListener(event, listener)
  }

  emit<T extends keyof MarkdownPluginEvents> (event: T, arg0: MarkdownPluginEvents[T]) {
    return super.emit(event, arg0)
  }
}

export function initialize (app: Application) {
  const plugin = new MarkdownPlugin(app)

  plugin.on('fileComplete', builder => {
    if (plugin.dir) {
      ensureDir(plugin.dir)
      const out = resolve(plugin.dir, basename(builder.fileName))
        .replace(/d?\.ts$/, 'md')
      writeFileSync(out, builder.toString())
    }
    if (plugin.stdout) {
      console.log(builder.toString())
    }
  })
}
