import { get } from 'svelte/store'
import * as commands from './commands'
import * as constants from './constants'
import * as path from './path'
import * as font from './font'
import * as history from './history'
import * as lines from './lines'
import * as system from './system'

declare global {
  interface Window {
    store: unknown
  }
}
window.store = {
  get,
  commands,
  constants,
  path,
  font,
  history,
  lines,
  system,
}
