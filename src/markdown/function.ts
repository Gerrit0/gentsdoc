import { convertFunction as convertFunctionSymbol } from '../json/function'
import { MarkdownBuilder } from './builder'
import { Symbol } from 'ts-simple-ast'
import { hasJSDocIgnoreTag, stringifyType, stringifyTags, stringifyFunctionSignature, isObjectTypeDocNode, isTupleTypeDocNode } from '../helpers'
import { FunctionSignatureDocNode, TypeDocNode } from '../json/schema'

export function convertFunction (node: Symbol, builder: MarkdownBuilder): void {
  const doc = convertFunctionSymbol(node)
  const signatures = doc.signatures.filter(s => !hasJSDocIgnoreTag(s))

  if (signatures.length === 0) return

  builder.header(`Function ${doc.name}`)

  signatures.forEach(signature => documentSignature(signature, builder))
}

function documentSignature (signature: FunctionSignatureDocNode, builder: MarkdownBuilder): void {
  builder.paragraph(signature.jsdoc.comment)
  .paragraph(`\`${stringifyFunctionSignature(signature)}\``)
  .paragraph(stringifyTags(signature.jsdoc.tags))

  if (signature.genericTypes.length) {
    builder.paragraph('**Generic Parameters**')
    typesToList(signature.genericTypes, builder)
    builder.line()
  }

  if (signature.parameters.length) {
    builder.paragraph('**Parameters**')
    typesToList(signature.parameters, builder)
    builder.line()
  }
}

function typesToList (types: TypeDocNode[], builder: MarkdownBuilder, indent = 0) {
  types.forEach(type => {
    builder.list(`${type.name} \`${stringifyType(type)}\` ${type.comment}`, indent)
    if (isObjectTypeDocNode(type) || isTupleTypeDocNode(type)) {
      typesToList(type.members, builder, indent + 1)
    }
  })
}
