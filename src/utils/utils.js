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

export function parseText(text, result = []) {
  const [match, leftText, title, url, rightText] 
    = text.match(/^(.*)\[(.*?)\]\((.*?)\)(.*)$/) || []
  
  if(!match) return [{ text }, ...result]

  return parseText(leftText, [{ text: title, url }, { text: rightText }, ...result])
}
