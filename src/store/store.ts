import { get } from 'svelte/store'
import { Commands } from './commands'
import * as constants from './constants'
import { Font } from './font'
import { History } from './history'
import * as lines from './lines'
import * as path from './path'
import { State } from './state'
import * as system from './system'

class Store {
  get = get
  commands = new Commands()
  constants = constants
  font = new Font()
  history = new History()
  lines = lines
  path = path
  state = new State()
  system = system
}

export const store = new Store()
void store.system.start()

declare global {
  interface Window {
    store: Store
  }
}
window.store = store
