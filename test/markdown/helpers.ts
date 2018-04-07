import { AppEventNames, Application } from '../../src/application'
import { MarkdownPlugin } from '../../src/markdown'

export function getFileDocs (file: string): Promise<string> {
  const app = new Application()
  app.include = [`test/${file}`]

  const plugin = new MarkdownPlugin(app)

  return new Promise((resolve) => {
    app.on(AppEventNames.done, () => {
      resolve(plugin.builder.toString())
    })
    app.documentFiles('test')
  })
}
