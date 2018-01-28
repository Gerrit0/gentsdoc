import { Option, OptionType, findFiles, makeMinimatch } from './helpers'
import { FileDocNode } from './schema'
import * as ts from 'typescript'
import { convertFile } from './converters/file'

export class Application {
  @Option({
    flag: 'include',
    help: 'Specify files to be included. By default, all declaration files will be included.',
    default: ['**/*.d.ts'],
    type: OptionType.stringArray
  })
  include: string[]

  @Option({
    flag: 'exclude',
    help: 'Specify files to be excluded from the output. Defaults to excluding node_modules, .git, and .spec.d.ts and .test.d.ts files.',
    default: ['**/*.{spec,test}.d.ts', 'node_modules', '.git'],
    type: OptionType.stringArray
  })
  exclude: string[]

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
      file.isDeclarationFile
    ].every(Boolean)
  }
}
