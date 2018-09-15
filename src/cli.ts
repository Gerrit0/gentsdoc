import { Application } from './application'
import { parseArgv } from './utils'

// Register converters
import './converters'
// Register renderers
import './renderers/html'

const app = new Application()

app.run(parseArgv(process.argv.slice(2)))
