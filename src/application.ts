import { Option, OptionType, findFiles, makeMinimatch } from './helpers'
import { FileDocNode } from './schema'
import Project, { SourceFile } from 'ts-simple-ast'
import { convertFile } from './converters/file'

export class Application {
  @Option({
    flag: 'include',
    help: 'Specify files to be included. By default, all declaration files will be included.',
    default: ['**/*.d.ts'],
    type: OptionType.stringArray
  })
  include !: string []

  @Option({
    flag: 'exclude',
    help: 'Specify files to be excluded from the output. Defaults to excluding node_modules, .git, and .spec.d.ts and .test.d.ts files.',
    default: ['**/*.{spec,test}.d.ts', 'node_modules', '.git'],
    type: OptionType.stringArray
  })
  exclude !: string []

  @Option({
    flag: 'plugin',
    help: 'Add a plugin to be loaded when parsing.',
    default: [],
    type: OptionType.stringArray
  })
  plugins !: string[]

  documentFiles (root: string = '.'): FileDocNode[] {
    const files = findFiles(this.include, this.exclude, root)
    const project = new Project()
    files.forEach(file => project.addSourceFileIfExists(file))

    const nodes: FileDocNode[] = project.getSourceFiles()
      .filter(this.shouldDocument, this)
      .map(convertFile)

    return nodes
  }

  protected shouldDocument (file: SourceFile): boolean {
    const relativeFile = file.getFilePath().replace(process.cwd().replace(/\\/g, '/') + '/', '')

    const includePatterns = this.include.map(makeMinimatch)
    const excludePatterns = this.exclude.map(makeMinimatch)

    return [
      includePatterns.some(pattern => pattern.match(relativeFile)),
      excludePatterns.every(pattern => !pattern.match(relativeFile)),
      file.isDeclarationFile
    ].every(Boolean)
  }

  protected loadPlugins (): void {
    this.plugins.forEach(require)
  }
}
