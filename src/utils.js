export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function slice(text) {
  let m = text.match(/\[(.*?)\]\((.*?)\)/)

  if(m) {
    const i = text.indexOf(m[0])

    return [
      { text: text.slice(0, i) },
      { text: m[1], url: m[2] },
      ...slice(text.slice(m[0].length + i, text.length))
    ]
  }

  return [{ text }]
}
