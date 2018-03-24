import { Application, AppEventNames } from '../../src/application'
import { FileDocNode } from '../../src/schema'
import { JSONPlugin } from '../../src/json'

export function getFileDocs (file: string): Promise<FileDocNode> {
  const app = new Application()
  app.include = [`test/${file}`]

  const plugin = new JSONPlugin(app)

  return new Promise<FileDocNode>((resolve) => {
    app.on(AppEventNames.done, () => {
      resolve(plugin.files[0])
    })
    app.documentFiles('test')
  })
}
