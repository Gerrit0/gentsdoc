import { DocNodeKind, PropertyDocNode } from '../schema'
import { getCommentFromNode, getPropertyComment } from '../helpers'
import { convertType } from './type'
import { PropertySignature, PropertyDeclaration } from 'ts-simple-ast'

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
