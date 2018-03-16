import { DocNodeComment } from '../schema'
import { SourceFile, Symbol, JSDocableNode } from 'ts-simple-ast'
import { flatMap } from 'lodash'

const normalizeNewlines = (s: string) => s.replace(/\r\n|\r/g, '\n')

export function getCommentFromSymbol (symbol: Symbol): DocNodeComment {
  return {
    comment: symbol.compilerSymbol.getDocumentationComment(undefined)
      .map(p => p.text)
      .map(normalizeNewlines)
      .join(''),
    tags: symbol.compilerSymbol.getJsDocTags()
      .map(tag => ({ tagName: tag.name, comment: normalizeNewlines(tag.text || '') }))
      .filter(tag => !['param', 'prop', 'property'].includes(tag.tagName))
  }
}

export function getCommentFromNode (node: JSDocableNode): DocNodeComment {
  const docs = node.getJsDocs()
  const tags = flatMap(docs, doc => doc.getTags())

  return {
    comment: docs.map(doc => doc.getComment() || '').join('\n'),
    tags: tags.map(tag => {
      const text = tag.getText()
      const [ tagName, ...words] = text.split(' ')

      return {
        tagName, comment: normalizeNewlines(words.join(' '))
      }
    })
  }
}

export function getFileComment (_file: SourceFile): DocNodeComment {
  const emptyComment: DocNodeComment = {
    comment: '',
    tags: []
  }

  return emptyComment

  // const commentRanges = ts.getLeadingCommentRanges(file.getFullText(), file.getFullStart())

  // if (!commentRanges || commentRanges.length < 1) return emptyComment

  // const firstCommentText = file.getFullText()
  //   .substring(commentRanges[0].pos, commentRanges[0].end)

  // if (!firstCommentText.startsWith('/***')) return emptyComment

  // // Use Typescript to parse the comment to retain reliable comment parsing
  // const commentFile = ts.createSourceFile(
  //   'comment.ts',
  //   firstCommentText.replace('/***', '/**') + '\nexport let a: any',
  //   ts.ScriptTarget.ESNext
  // )

  // const first = commentFile.statements[0] as ts.Node

  // return createCommentFromJSDoc(getJSDoc(first))
}

// function getCommentFromPropertyLikeTag (tagNames: string[], node: ts.Node, name: string): string {
//   const docs = getJSDoc(node)

//   const tag = flatMap(docs, doc => toArray(doc.tags))
//     .filter(tag => tagNames.includes(tag.tagName.text))
//     .map(tag => {
//       // "@param arg.0" will result in the name "arg." as 0 is not a valid identifier.
//       // To support documenting tuples, override this.
//       const badCommentSplit = ts.isJSDocPropertyLikeTag(tag) && tag.name.getText().endsWith('.')

//       const fullText = [tag.getText(), tag.comment || '']
//         .join(badCommentSplit ? '' : ' ')

//       const [, tagName, comment] = fullText.match(/^@\w+\s+([$\w.]+)\s+(.*)$/)!
//       return {
//         tagName, comment
//       }
//     })
//     .find(tag => tag.tagName === name)
//   return tag ? tag.comment || '' : ''
// }

// export const getPropertyComment = curry(getCommentFromPropertyLikeTag)(['property', 'prop'])
// export const getParamComment = curry(getCommentFromPropertyLikeTag)(['param'])

// export function createCommentFromJSDoc (nodes: ts.JSDoc[]): DocNodeComment {
//   return {
//     comment: nodes.map(node => node.comment || '').filter(Boolean).join('\n'),
//     tags: flatMap(nodes, (node: ts.JSDoc) => toArray(node.tags))
//       .map(createTag)
//       .filter(tag => !['param', 'prop', 'property'].includes(tag.tagName))
//   }
// }

// function createTag (tag: ts.JSDocTag): DocNodeTag {
//   return {
//     tagName: tag.tagName.text,
//     // For some strange reason, tags sometimes only have \r separating lines.
//     comment: (tag.comment || '').replace(/\r\n|\r|\n/g, '\n')
//   }
// }
