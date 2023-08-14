import { makeAutoObservable } from "mobx";
import { TileProps } from "./Tile";

class Store {
  highlight = false;
  plan = [{
    material: "200.777.001",
    quantity: 42,
    perPalet: 6,
    storageBin: "A1",
  },{
    material: "200.777.002",
    quantity: 240,
    perPalet: 120,
    storageBin: "B1",
  }];

  constructor() {
    makeAutoObservable(this);
  }

  get tiles(): TileProps[] {
    const tiles = [];

    tiles.push(...this.plan.map(item => ({
      title: item.material,
      value: item.quantity,
      info: "Picking not started yet",
    })));

    tiles.push(...this.pallets.map(item => ({
      title: item.pallet,
      description: item.material,
      value: item.quantity,
      info: `TO: ${item.transferOrder}`,
      leftInfo: item.storageBin,
      intent: "primary",
    })));

    tiles.push(...this.pallets.map((item, i) => ({
      title: item.pallet,
      description: item.material,
      value: item.quantity,
      info: i ? item.storageBin : "Something is wrong with this pallet. It's broken or on the way somewhere.",
      intent: i ? "success" : "error",
    })));

    tiles.push(...this.pallets.filter(item => item.quantity < 10).map((item, i) => ({
      title: item.pallet,
      description: item.material,
      value: item.quantity,
      info: i ? `Scanned: ${i}/${item.quantity}` : "Ready to scan",
      progress: i * 100 / item.quantity,
    })));

    tiles.push(...this.pallets.filter(item => item.quantity > 10).map((item, i) => ({
      title: item.pallet,
      description: item.material,
      value: item.quantity,
      info: i ? `Scanned: 360/${item.quantity}` : "Some scanned pallet have a problem",
      progress: i ? undefined : 30,
      intent: "error",
    })));

    tiles.push(...this.plan.map(item => ({
      title: item.material,
      value: item.quantity,
      info: "Everything is done",
      intent: "success",
    })));

    return tiles;
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
}

export const store = new Store();
