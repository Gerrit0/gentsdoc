import { Application } from './application'
// import * as ts from 'typescript'
// import { HtmlGenerator } from './output/html'

const app = new Application({
  entry: './test/enum.ts'
})

app.options.read(app.logger)

if (app.options.getOption('help')) {
  app.logger.log(app.options.getHelpOutput())
  process.exit(0)
}

// app.output.addGenerator(new HtmlGenerator())

app.output.addGenerator({
  enabled: () => true,
  generate (_app, symbols) {
    console.log(symbols.map(s => s.name))
  }
})

app.generate()
