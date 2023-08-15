export type Intent = "default" | "primary" | "success" | "error";

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
  primary: {
    background: "lightblue",
  },
  success: {
    background: "lightgreen",
  },
  error: {
    background: "red",
    font: "white",
  },
};
