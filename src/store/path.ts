import { makeAutoObservable } from "mobx";

export class Path {
  value = "~";

  constructor() {
    makeAutoObservable(this);
  }
  
  get pwd(): string {
    return this.value.replace(/^~/, "/root");
  }

  async cd(newDir: string): Promise<void> {
    const { cd } = await import("../utils/cd");
    this.value = cd(this.value, newDir);
  }
}
