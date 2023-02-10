export function isFontExist(font: string): boolean {
  return !!(
    fontCompare(font, "serif") ||
    fontCompare(font, "sans-serif") ||
    fontCompare(font, "cursive") ||
    fontCompare(font, "monospace")
  );
}

function fontCompare(font: string, baseFont: string): boolean {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) {
    return false;
  }

  const text = "abcdefghijklmnopqrstuvwxyz0123456789";
  context.font = `72px ${baseFont}`;
  const baselineSize = context.measureText(text).width;
  context.font = `72px ${font}, ${baseFont}`;
  const newSize = context.measureText(text).width;
  return newSize !== baselineSize;
}
