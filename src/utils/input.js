export function prepareText({ text, start, end }) {
  const isSelection = start !== end
  const newEnd = end + (isSelection ? 0 : 1)

  const preparedText = [
    text.slice(0, start),
    text.slice(start, newEnd),
    text.slice(newEnd),
  ]

  if(preparedText[1] === '') preparedText[1] = '\u00a0'

  return { isSelection, preparedText }
}
