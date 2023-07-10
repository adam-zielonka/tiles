import { makeAutoObservable } from "mobx";
import { isFontExist } from "../utils/font";

export class Style {
  font = "";

  constructor() {
    makeAutoObservable(this);
  }

  set(font: string): string[] {
    if (!isFontExist(font) && font) {
      return [`Font family **'${font}'** is not installed`];
    }

    this.font = `${font ? font + ", " : ""}"Courier New", Courier, monospace`;
    return [];
  }
}
