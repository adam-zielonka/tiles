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

  async cd(newDir: string): Promise<void> {
    this.value = cd(this.value, newDir);
  }
}
