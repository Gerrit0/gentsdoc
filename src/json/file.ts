import { SourceFile } from 'ts-simple-ast'
import { getFileComment } from '../helpers'
import { DocNodeKind, FileDocNode } from '../schema'

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
