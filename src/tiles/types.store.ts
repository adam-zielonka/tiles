export type Material = {
  id: string,
}

export type Order = {
  material: Material,
  quantity: number,
}

export type StorageBin = {
  id: string,

}

export type Pallet = {
  material: Material,
  quantity: number,
  serial: string[],
}

export type TransferOrderItem = {
  pallet: Pallet,
  storageBin: StorageBin,
}

export type TransferOrder = {
  id: string,
  items: TransferOrderItem[],
}

export type VDACheck = {
  pallet: Pallet,
  status: Record<string, boolean>,
}
