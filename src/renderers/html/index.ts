import { Renderer, StringOption } from '../../utils'
import { renderPage } from './page'
import { AbstractRenderer } from '../abstract'
import { renderEnum } from './enum'
import { EnumReflection } from '../../converters'
import { writeFileSync } from 'fs'

@Renderer('minimal')
export class HTMLRenderer extends AbstractRenderer {
  @StringOption({
    flag: 'minimal-style',
    help: 'The CSS file included by the generated page when using the minimal renderer, used for theming'
  })
  style = __dirname + 'style.css'

  @StringOption({
    flag: 'minimal-title',
    help: 'The title of the generated page when using the minimal renderer.'
  })
  title = 'Documentation'

  enumerations: EnumReflection[] = []

  initialize () {
    this.application.on('enum', reflection => this.enumerations.push(reflection))
  }

  render () {
    const toc: [string, string[]][] = [
      ['Enumerations', this.enumerations.map(e => e.name)]
    ]
    const entries = [
      ...this.enumerations.map(renderEnum)
    ]

    writeFileSync('index.html', renderPage(this.title, entries, toc), 'utf-8')
  }
}
