export type Intent = "default" | "primary" | "success" | "error" | "warning";

type Colors = {
  [key in Intent]: {
    background: string
    font?: string
  }
}

const ALV = {
  BLUE: "#bdd7ee",
  GRAY: "#d4dfef",
  YELLOW: "#fff843",
  PEAR: "#e5f4a6",
  GREEN: "#ccffcc",
  RED: "#e16758",
  ORANGE: "#f8e5c8",
};

export const COLORS: Colors = {
  default: {
    background: "white",
  },
  primary: {
    background: ALV.BLUE,
  },
  success: {
    background: ALV.GREEN,
  },
  error: {
    background: ALV.RED,
    font: "white",
  },
  warning: {
    background: ALV.ORANGE,
  },
};
