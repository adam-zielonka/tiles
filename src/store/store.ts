import { get } from 'svelte/store'
import * as commands from './commands'
import * as constants from './constants'
import * as font from './font'
import { History } from './history'
import * as lines from './lines'
import * as path from './path'
import { State } from './state'
import * as system from './system'

class Store {
  history = new History()
  state = new State()
}

export const store = new Store()

void system.start()

const storeMap = {
  get,
  commands,
  constants,
  font,
  lines,
  path,
  system,
  store,
}
declare global {
  interface Window {
    store: typeof storeMap
  }
}
window.store = storeMap
