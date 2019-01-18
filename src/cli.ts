import { Application } from './application'
import { HtmlGenerator } from './output/html'

const app = new Application({
  entries: ['./test/enum.ts'],
  html: './docs'
})

app.output.addGenerator(new HtmlGenerator())

app.generate()
