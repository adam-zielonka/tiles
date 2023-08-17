import { makeAutoObservable } from "mobx";
import { TileProps } from "./tile";

type Material = string;
type StorageBin = string
type Quantity = number;
type TransferOrder = string

export type Order = {
  material: Material,
  quantity: Quantity,
}

export type Pallet = {
  material: Material,
  quantity: Quantity,
  storageBin: StorageBin,
}

export type TransferOrderItem = {
  id: TransferOrder,
  item: number,
  pallet: Pallet,
}

export class System {
  orders: Order[] = [];
  pallets: Pallet[] = [];
  transferOrders: TransferOrderItem[] = [];

  constructor() {
    makeAutoObservable(this);

    this.orders = [{
      material: "200.777.001",
      quantity: 42,
    },{
      material: "200.777.002",
      quantity: 240,
    }];

    for (let i = 1; i < 7; i++) {
      this.pallets.push({
        material: "200.777.001",
        quantity: 6,
        storageBin: `A-0${i}`,
      });
      this.pallets.push({
        material: "200.777.002",
        quantity: 120,
        storageBin: `B-0${i}`,
      });
    }

    this.createTransferOrder();
  }

  createTransferOrder = () => {
    for (const order of this.orders) {
      let left = order.quantity;
      this.pallets.forEach((pallet, i) => {
        if (left > 0) {
          left -= pallet.quantity;
          this.transferOrders.push({
            id: "1234567",
            item: i + 1,
            pallet,
          });
        }
      });
    }
  };

  get tiles(): TileProps[] {
    const tiles: TileProps[] = [];

    for (const order of this.orders) {
      const quantity = this.transferOrders.reduce((acc, item) => {
        if (item.pallet.material === order.material) {
          return acc + item.pallet.quantity;
        }

        return acc;
      }, 0);

      const missing = order.quantity - quantity;

      if (missing > 0) {
        tiles.push({
          title: order.material,
          value: missing,
          info: this.transferOrders.length ? "Missing TO" : "Picking not started yet",
          icon: "plan",
          intent: this.transferOrders.length ? "warning" : "default",
        });
      }
    }

    for (const transferOrder of this.transferOrders) {
      tiles.push({
        title: transferOrder.pallet.material,
        value: transferOrder.pallet.quantity,
        info: `TO: ${transferOrder.id}`,
        leftInfo: transferOrder.pallet.storageBin,
        intent: "primary",
        icon: "transfer",
      });
    }
    
    
    return tiles;
  }

}
