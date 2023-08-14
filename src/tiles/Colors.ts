export type Intent = "default" | "transfer-order" | "pallet" | "error";

type Colors = {
  [key in Intent]: {
    background: string
    font?: string
  }
}

export const COLORS: Colors = {
  default: {
    background: "white",
  },
  "transfer-order": {
    background: "lightblue",
  },
  pallet: {
    background: "lightgreen",
  },
  error: {
    background: "red",
    font: "white",
  },
};
