import links from './src/links.json'
import replace from 'replace-in-file'

function slice(line) {
  let match = line.match(/\[(.*?)\]\((.*?)\)/)

  if(match) {
    const index = line.indexOf(match[0])

    return [
      { text: line.slice(0, index) },
      { text: match[1], url: match[2] },
      ...slice(line.slice(match[0].length + index, line.length))
    ]
  }

  return [{ text: line }]
}

const html = links.map(line => {
  const sliced = slice(line).filter(s => s.text)
  return `<li class="step-4">${sliced.map(s => s.url ? `<a href="${s.url}">${s.text}</a>` : (s.text || '&nbsp;') ).join('') || '&nbsp;'}</li>`
}).join('')

replace({
  files: './build/index.html',
  from: /<links\/>/,
  to: html,
}).then(results => {
  if(results[0].hasChanged)
    console.log('Added links to no-script section')
  else
    console.error('Not found <links/> tag')
}).catch(error => {
  console.error('Error occurred:', error)
})
