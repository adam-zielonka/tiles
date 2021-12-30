import { Commands } from './commands'
import { Font } from './font'
import { History } from './history'
import { Lines } from './lines'
import { Path } from './path'
import { State } from './state'
import * as system from './system'

class Store {
  commands = new Commands()
  font = new Font()
  history = new History()
  lines = new Lines()
  path = new Path()
  state = new State()
  system = system
}

export const store = new Store()
void store.system.start(['whoami', 'description'])

declare global {
  interface Window {
    store: Store
  }
}
window.store = store
