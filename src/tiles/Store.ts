import { makeAutoObservable } from "mobx";

class Store {
  highlight = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleHighlight() {
    this.highlight = !this.highlight;
  }
}

export const store = new Store();
