import { makeAutoObservable } from "mobx";

export class Style {
  font = "";

  constructor() {
    makeAutoObservable(this);
  }

  async set(font: string): Promise<string[]> {
    const { isFontExist } = await import("../utils/font");

    if (!isFontExist(font) && font) {
      return [`Font family **'${font}'** is not installed`];
    }

    this.font = `${font ? font + ", " : ""}"Courier New", Courier, monospace`;
    return [];
  }
}
