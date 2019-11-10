import { Application } from './application'
import { HtmlGenerator } from './output'

const app = new Application({
  entry: './test/enum.ts',
  out: 'docs.html'
})

app.options.read(app.logger)

if (app.options.getOption('help')) {
  app.logger.log(app.options.getHelpOutput())
  process.exit(0)
}

app.output.addGenerator(new HtmlGenerator())

app.generate().catch(console.error)
