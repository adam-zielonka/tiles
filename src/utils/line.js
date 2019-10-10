export function parseText(text, result = []) {
  const [match, leftText, title, url, rightText] 
    = text.match(/^(.*)\[(.*?)\]\((.*?)\)(.*)$/) || []
  
  if(!match) return [{ text }, ...result]

  return parseText(leftText, [{ text: title, url }, { text: rightText }, ...result])
}
