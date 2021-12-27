import fs from 'fs'
import replace, { replaceInFileSync } from 'replace-in-file'
import { marked, Renderer } from 'marked'
import crypto from 'crypto'

Renderer.prototype.paragraph = function (text) {
  return text
}

function getFileHash(file) {
  const hash = crypto.createHash('shake256', { outputLength: 8 })
  return hash.update(fs.readFileSync(file, 'utf8')).digest('hex')
}

function renameFile(file, newName) {
  fs.renameSync('./build/' + file, './build/' + newName)

  const results = replaceInFileSync({
    files: './build/index.html',
    from: new RegExp(file, 'g'),
    to: newName,
  })

  if (results[0].hasChanged) console.log(`Renamed ${file} to ${newName}`)
  else console.error(`Not found ${file}`)
}

renameFile('build', `assets`)

const hashBundleJs = getFileHash('./build/assets/bundle.js')
const hashBundleCss = getFileHash('./build/assets/bundle.css')

renameFile('assets/bundle.js', `assets/bundle.${hashBundleJs}.js`)
renameFile('assets/bundle.css', `assets/bundle.${hashBundleCss}.css`)

fs.renameSync(
  './build/assets/bundle.js.map',
  `./build/assets/bundle.${hashBundleJs}.js.map`,
)

const results = replaceInFileSync({
  files: [
    `./build/assets/bundle.${hashBundleJs}.js.map`,
    `./build/assets/bundle.${hashBundleJs}.js`,
  ],
  from: 'bundle.js',
  to: `bundle.${hashBundleJs}.js`,
})

if (results[0].hasChanged) console.log(`Update js and map files`)
else console.error(`Problem with js and map files`)

function createClock() {
  return (
    clock => delay =>
      (clock += delay || 0)
  )(0)
}

const clock = createClock()

clock(100)

function parseCommand(body) {
  const array = body.split('\n').map(m => m.replace(/^ *$/, ''))

  const base = { time: 20 }
  const lines = []
  let settings = {}

  for (const text of array) {
    const [match, namespace, action] = text.match(/^\[\]\((.*):(.*)\)$/) || []
    if (match) {
      if (namespace === 'sleep') {
        settings.time = +action
      } else {
        settings[namespace] = action
      }
    } else {
      lines.push({ ...base, ...settings, text })
      settings = {}
    }
  }

  if (!lines.length) lines.push({ text: '', ...base, ...settings })
  if (lines[lines.length - 1].system) lines.push({ ...base, text: '' })

  return lines
}

function randomLetter() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function userLine(command) {
  const splitted = command.split('')

  function blinkTimes(start, end) {
    return Math.ceil((end - start) / 500) + 2
  }

  let result = ''
  result += 'root@adamzielonka.pro'
    .split('')
    .map(
      l =>
        `<div class="user" style="animation: hidden ${clock()}ms;">${l}</div>` +
        `<div class="hidden">${randomLetter()}</div>`,
    )
    .join('')
  result += `<div class="user-end" style="animation: hidden ${clock()}ms;">:~#&nbsp;</div>`
  const startTime = clock()
  clock(1000)
  result += splitted
    .map(
      l => `<div class="user-end" style="animation: hidden ${clock(50)}ms;">${l}</div>`,
    )
    .join('')
  result += `<div class="blink" style="animation: blink 500ms linear ${startTime}ms ${blinkTimes(
    startTime,
    clock(),
  )};">_</div>`
  clock(1000)
  return `<li>${result}</li>`
}

function lines(command) {
  let body = fs.readFileSync(`./src/commands/${command}.md`, 'utf8')
  if (!body) return ''
  body = body.replace(/---[ \s\S]*---\n/, '')

  const lines = parseCommand(body)
    .filter(f => !f.system)
    .map(
      line =>
        `<li style="animation: hidden ${clock(line.time)}ms;">${marked(
          line.text || '\u00a0',
        )}</li>`,
    )
  lines.shift()
  return lines.join('')
}

function runCommand(command) {
  return userLine(command) + lines(command)
}

let html =
  '<ul>' +
  runCommand('whoami') +
  runCommand('description') +
  userLine('') +
  lines('panic') +
  '</ul>'

html = html
  .replace(/ul><li/g, 'ul>\n          <li')
  .replace(/<\/li><li/g, '</li>\n          <li')
  .replace(/><div/g, '>\n            <div')
  .replace(/div><\//g, 'div>\n          </')
  .replace(/li><\/ul/g, 'li>\n        </ul')

replace({
  files: './build/index.html',
  from: /<links \/>/g,
  to: html,
})
  .then(results => {
    if (results[0].hasChanged) console.log('Generated no-script section')
    else console.error('Not found <links/> tag')
  })
  .catch(error => {
    console.error('Error occurred:', error)
  })
