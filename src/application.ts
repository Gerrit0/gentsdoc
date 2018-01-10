import { Option, OptionType, findFiles, makeMinimatch } from './helpers'
import { FileDocNode } from './schema'
import * as ts from 'typescript'
import { convertFile } from './converters'

export class Application {
  @Option({
    flag: 'include',
    help: 'Specify files to be included. By default, all .ts files will be included.',
    default: ['**/*.ts'],
    type: OptionType.stringArray
  })
  include: string[]

  @Option({
    flag: 'exclude',
    help: 'Specify files to be excluded from the output. Defaults to excluding node_modules, .git, and .spec.ts and .test.ts files.',
    default: ['**/*.{spec,test}.ts', 'node_modules', '.git'],
    type: OptionType.stringArray
  })
  exclude: string[]

  @Option({
    flag: 'includeDeclarations',
    help: 'If true, parse .d.ts files, otherwise ignore them.',
    default: false,
    type: OptionType.boolean
  })
  includeDeclarations: boolean

  documentFiles (root: string = '.'): FileDocNode[] {
    const files = findFiles(this.include, this.exclude, root)
    const program = ts.createProgram(
      files,
      { target: ts.ScriptTarget.ESNext }
    )
    const checker = program.getTypeChecker()

    const nodes: FileDocNode[] = program.getSourceFiles()
      .filter(this.shouldDocument, this)
      .map(file => convertFile(file, checker))

    return nodes
  }

  protected shouldDocument (file: ts.SourceFile): boolean {
    const relativeFile = file.fileName.replace(process.cwd().replace(/\\/g, '/') + '/', '')

    const includePatterns = this.include.map(makeMinimatch)
    const excludePatterns = this.exclude.map(makeMinimatch)

    return [
      includePatterns.some(pattern => pattern.match(relativeFile)),
      excludePatterns.every(pattern => !pattern.match(relativeFile)),
      this.includeDeclarations || !file.isDeclarationFile
    ].every(Boolean)
  }
}
