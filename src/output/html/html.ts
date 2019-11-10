import { OutputGenerator } from '..'
import { Options, Application, Context } from '../..'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { Renderer } from './renderer'

const promises = {
  writeFile: promisify(writeFile)
}

export class HtmlGenerator implements OutputGenerator {
  enabled (_options: Options): boolean {
    return true // Until more generators are available, it doesn't make sense to ever be disabled.
  }

  async generate (app: Application, symbols: readonly Context[]): Promise<void> {
    const renderer = new Renderer(app)
    const page = await renderer.render(symbols)

    console.log(page)
    await promises.writeFile(app.options.getOption('out'), page, 'utf-8')
  }
}
