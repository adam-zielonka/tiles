import { Commands } from "./commands";
import { History } from "./history";
import { Lines } from "./lines";
import { Path } from "./path";
import { Style } from "./style";
import { System } from "./system";

class Store {
  commands = new Commands();
  history = new History();
  lines = new Lines();
  path = new Path();
  style = new Style();
  system = new System();
}

export const store = new Store();
void store.system.start(["whoami", "description"]);

declare global {
  interface Window {
    store: Store
  }
}
window.store = store;
