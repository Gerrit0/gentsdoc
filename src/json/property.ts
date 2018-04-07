import { PropertyDeclaration, PropertySignature } from 'ts-simple-ast'
import { getCommentFromNode, getPropertyComment } from '../helpers'
import { DocNodeKind, PropertyDocNode } from './schema'
import { convertType } from './type'

export function convertProperty (node: PropertySignature | PropertyDeclaration): PropertyDocNode {
  return {
    kind: DocNodeKind.property,
    name: node.getName(),
    type: convertType(node.getType(), node.getTypeNode(), getPropertyComment(node)),
    jsdoc: getCommentFromNode(node),
    optional: node.hasQuestionToken(),
    readonly: node.isReadonly()
  }
}
