import { FileDocNode, DocNodeKind } from '../schema'
import { SourceFile } from 'ts-simple-ast'
import { getFileComment } from '../helpers'

export function getFileDoc (file: SourceFile): FileDocNode {
  return {
    name: file.getFilePath(),
    kind: DocNodeKind.file,
    jsdoc: getFileComment(file),
    functions: [],
    enumerations: [],
    classes: [],
    interfaces: [],
    types: [],
    variables: []
  }
}
