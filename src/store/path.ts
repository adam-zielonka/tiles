import { makeAutoObservable } from "mobx";
import { cd } from "../utils/cd";

export class Path {
  value = "~";

  constructor() {
    makeAutoObservable(this);
  }
  
  get pwd(): string {
    return this.value.replace(/^~/, "/root");
  }

  cd(newDir: string): void {
    this.value = cd(this.value, newDir);
  }
}
