import { makeAutoObservable } from "mobx";

export class Dimensions {
  width: number;
  height: number;

  constructor() {
    makeAutoObservable(this);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    window.addEventListener("resize", this.update);
  }

  get isMobile() {
    return this.width < 900;
  }

  get isMedium() {
    return this.width < 1250;
  }

  private update = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  };
}
