import { get } from 'svelte/store'
import * as commands from './commands'
import * as constants from './constants'
import * as font from './font'
import * as history from './history'
import * as lines from './lines'
import * as path from './path'
import * as state from './state'
import * as system from './system'

const store = {
  get,
  commands,
  constants,
  font,
  history,
  lines,
  path,
  state,
  system,
}

declare global {
  interface Window {
    store: typeof store
  }
}
window.store = store
