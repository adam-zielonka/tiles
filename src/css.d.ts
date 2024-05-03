import "csstype";

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface Properties {
    [index: `--tile-${string}`]: string;
  }
}
