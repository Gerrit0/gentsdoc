import { OutputGenerator } from '../output'
import { renderToStaticMarkup } from 'react-dom/server'
import * as React from 'react'
import { renderEnum } from './enum'
import { writeFileSync } from 'fs'
import { Context } from '../../context'
import { Application } from '../../application'
import { Options } from '../../options/options'
import { join, resolve } from 'path'
import { renderPage } from './page'

export class HtmlGenerator implements OutputGenerator {
  enabled (options: Options): boolean {
    return options.isSet('html')
  }

  generate (app: Application, contexts: ReadonlyArray<Context>) {
    const outputPath = resolve(app.options.getOption('html'))

    const enums = contexts.map(renderEnum)

    const enumPage = renderPage('Enums', <main>{enums}</main>)

    writeFileSync(join(outputPath, 'enum.html'), renderToStaticMarkup(enumPage))
  }
}
