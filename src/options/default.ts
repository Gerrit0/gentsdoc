import { Options } from './options'

export function addDefaultOptions (options: Options) {
  options.declareOption({
    name: 'entries',
    help: 'The entry point(s) of the program',
    default: ['src/index.ts']
  })

  options.declareOption({
    name: 'html',
    help: 'The output directory for HTML output',
    default: ''
  })
}
