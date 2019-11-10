import * as tsdoc from '@microsoft/tsdoc'

import { Context } from './context'
import { Logger } from './utils/logger'

/**
 * Before documentation is generated, all relevant nodes are joined into a {@link Project} which
 * resolves all nodes and generates a tree of their declaration references to enable cross linking.
 */
export class Project {
  constructor (readonly nodes: readonly Context[]) {}
}

export class ReferenceTree {
  self?: Context
  exports = new Map<string, ReferenceTree>()

  constructor (nodes: readonly Context[], root?: Context) {
    this.self = root
    for (const node of nodes) {
      this.exports.set(node.reference, new ReferenceTree(node.exportContexts, node))
    }
  }

  getContext (reference: tsdoc.DocDeclarationReference): Context | undefined {
    let tree: ReferenceTree = this
    for (const ref of reference.memberReferences) {
      if (!ref.memberIdentifier) {
        Logger.error('Symbol references are not yet supported')
        return
      }
      const identifier = ref.memberIdentifier.identifier
      const nextTree = tree.exports.get(identifier)
      if (!nextTree) {
        // TODO: Try :class, :enum, etc.
        Logger.error('Reference not found.')
        return
      }
      tree = nextTree
    }

    if (tree === this) {
      Logger.error('Package names and file paths are not yet supported.')
      return
    }

    return tree.self
  }
}
