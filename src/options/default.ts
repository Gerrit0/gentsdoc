import { Options } from './options'

export function addDefaultOptions (options: Options) {
  options.declareOption({
    name: 'help',
    help: 'Display this message',
    default: false
  })

  options.declareOption({
    name: 'entry',
    help: 'The entry point(s) of the program',
    default: 'src/index.ts' // TODO: Look at the types / typings key of package.json to find entry point when using CLI
  })
}
