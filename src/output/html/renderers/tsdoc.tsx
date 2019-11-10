// Heavily influenced by the playground renderer - https://github.com/microsoft/tsdoc/blob/master/playground/src/DocHtmlView.tsx

import React from 'react'
import * as tsdoc from '@microsoft/tsdoc'
import { Context } from '../../../context'

export function TSDoc ({ node }: { node: Context }) {
  const comment = node.getDocComment()
  if (!comment) {
    return <></>
  }

  return <TSDocComment comment={comment} />
}

export function TSDocComment ({ comment }: { comment: tsdoc.DocComment }) {
  return <React.Fragment>{comment.emitAsTsdoc()}</React.Fragment>
}
