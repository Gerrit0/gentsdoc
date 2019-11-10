import * as ts from 'typescript'
import * as tsdoc from '@microsoft/tsdoc'
import { renderToStaticMarkup } from 'react-dom/server'

import { Context, Application } from '../..'

import { renderEnum } from './renderers/enum'

type MaybePromise<T> = T | Promise<T>

const renderers: { [K in ts.SymbolFlags]?: (context: Context, renderer: Renderer) => MaybePromise<JSX.Element> } = {
  [ts.SymbolFlags.Enum]: renderEnum
}

/**
 * Unfortunately, to support \@inheritdoc, we have to maintain a list of nodes which can't be documented
 * immediately. This class maintains the required list and provides a few helper methods for the JSX rendering
 * functions to call if required.
 */
export class Renderer {
  // TODO: Make it possible to pass configuration for this renderer
  readonly parser = new tsdoc.TSDocParser()

  constructor (private app: Application) {}

  async render (symbols: readonly Context[]): Promise<string> {
    const docs = await Promise.all(symbols.map(s => this.renderSymbol(s)))
    return docs.join('\n' + '<br>'.repeat(50) + '\n')
  }

  async renderSymbol (symbol: Context): Promise<string> {
    for (const [flag, renderer] of Object.entries(renderers)) {
      if (symbol.hasFlag(+flag)) {
        return renderToStaticMarkup(await renderer!(symbol, this))
      }
    }

    this.app.logger.error(`Could not document ${symbol.name} with flags ${ts.SymbolFlags[symbol.symbol.flags]}`)
    return ''
  }

  async renderDocComment (context: Context): Promise<string> {
    const comments = context.getLeadingCommentRanges()
    console.log(comments)
    return 'docs!'
  }

  makeSlug (where: tsdoc.DocDeclarationReference) {
    return where.emitAsTsdoc()
  }
}
