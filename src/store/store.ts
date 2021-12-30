import { Commands } from './commands'
import { Font } from './font'
import { History } from './history'
import { Lines } from './lines'
import { Path } from './path'
import { System } from './system'

class Store {
  commands = new Commands()
  font = new Font()
  history = new History()
  lines = new Lines()
  path = new Path()
  system = new System()
}

export const store = new Store()
void store.system.start(['whoami', 'description'])

declare global {
  interface Window {
    store: Store
  }
}
window.store = store
