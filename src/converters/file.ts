import { FileDocNode, DocNodeKind } from '../schema'
import { SourceFile, Node, ExportableNode } from 'ts-simple-ast'
import { getFileComment } from '../helpers'
import { convertEnum } from './enum'
import { uniq } from 'lodash'
import { convertFunction } from './function'

export function convertFile (file: SourceFile): FileDocNode {
  const doc: FileDocNode = {
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

  const getExportSymbols = (nodes: Array<Node & ExportableNode>) => {
    const symbols = nodes.filter(node => node.isExported()).map(node => node.getSymbolOrThrow())
    return uniq(symbols)
  }

  doc.enumerations = getExportSymbols(file.getEnums()).map(convertEnum)
  doc.functions = getExportSymbols(file.getFunctions()).map(convertFunction)

  return doc
}
