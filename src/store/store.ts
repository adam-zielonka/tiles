import { makeAutoObservable } from "mobx";
import { TileProps } from "../components/tile";
import { Dimensions } from "./dimensions.store";
import { System } from "./types.store";

class Store {
  dimensions = new Dimensions();
  system = new System();

  highlight = false;
  step = -1;
  plan = [{
    material: "200.777.001",
    quantity: 42,
    perPalet: 6,
    storageBin: "A",
  },{
    material: "200.777.002",
    quantity: 240,
    perPalet: 120,
    storageBin: "B",
  }];

  constructor() {
    makeAutoObservable(this);
  }

  get tiles(): TileProps[] {
    const tiles = [];

    if (this.step < 0 || this.step === 0) 
      tiles.push(...this.plan.map(item => ({
        title: item.material,
        value: item.quantity,
        info: "Picking not started yet",
        icon: "plan",
      })));

    if (this.step < 0 || this.step === 1) 
      tiles.push({
        title: "200.777.042",
        value: 1,
        info: "Not available on warehouse",
        icon: "plan",
        intent: "warning",
      });

    if (this.step < 0 || this.step === 1) 
      tiles.push(...this.pallets.map(item => ({
        title: item.material,
        value: item.quantity,
        info: `TO: ${item.transferOrder}`,
        leftInfo: item.storageBin,
        intent: "primary",
        icon: "transfer",
      })));

    if (this.step < 0 || this.step === 2) 
      tiles.push(...this.pallets.map((item, i) => ({
        title: item.pallet,
        description: item.material,
        value: item.quantity,
        info: i ? item.storageBin : "Something is wrong with this pallet. It's broken or on the way somewhere.",
        intent: i ? "success" : "error",
        icon: "pick",
      })));

    if (this.step < 0 || this.step === 3) 
      tiles.push(...this.pallets.filter(item => item.quantity < 10).map((item, i) => ({
        title: item.pallet,
        description: item.material,
        value: item.quantity,
        info: i ? `Scanned: ${i}/${item.quantity}` : "Ready to scan",
        progress: i === item.quantity ? undefined : i * 100 / item.quantity,
        intent: i === item.quantity ? "success" : undefined,
        icon: "pick",
      })));

    if (this.step < 0 || this.step === 3) 
      tiles.push(...this.pallets.filter(item => item.quantity > 10).map((item, i) => ({
        title: item.pallet,
        description: item.material,
        value: item.quantity,
        info: i ? `Scanned: 360/${item.quantity}` : "Some scanned pallet have a problem",
        progress: i ? undefined : 30,
        intent: "error",
        icon: "pick",
      })));

    if (this.step === 4) 
      tiles.push(...this.pallets.map(item => ({
        title: item.pallet,
        description: item.material,
        value: item.quantity,
        info: `Scanned: ${item.quantity}/${item.quantity}`,
        intent: "success",
        icon: "pick",
      })));

    if (this.step < 0 || this.step === 5) 
      tiles.push(...this.plan.map(item => ({
        title: item.material,
        value: item.quantity,
        info: "Everything is done",
        intent: "success",
        icon: "post",
      })));

    return tiles as TileProps[];
  }

  get pallets() {
    const pallets = [];

    for (const item of this.plan) {
      for (let i = 0; i < item.quantity / item.perPalet; i++) {
        const id = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;

        pallets.push({
          material: item.material,
          transferOrder: "1234567",
          quantity: item.perPalet,
          storageBin: `${item.storageBin}-${id}`,
          pallet: `30${item.material.replace(/\.|0/g, "")}0${id}`,
        });
      }
    }

    return pallets;
  }

  toggleHighlight() {
    this.highlight = !this.highlight;
  }

  filter(value: number) {
    this.step = value;
  }

  back() {
    this.step--;
    if (this.step < 0) {
      this.step = 5;
    }
  }

  next() {
    this.step++;
    if (this.step > 5) {
      this.step = 0;
    }
  }
}

export const store = new Store();
