/* eslint-disable no-console */
import fs from 'fs'
import replace, { replaceInFileSync } from 'replace-in-file'
import crypto from 'crypto'

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

const hashGlobalCss = getFileHash('./build/global.css')
const hashBundleJs = getFileHash('./build/assets/bundle.js')
const hashBundleCss = getFileHash('./build/assets/bundle.css')

renameFile('global.css', `global.${hashGlobalCss}.css`)
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

export function parseText(text, result = []) {
  const [match, leftText, title, url, rightText] =
    text.match(/^(.*)\[(.*?)\]\((.*?)\)(.*)$/) || []

  if (!match) return [{ text }, ...result]

  return parseText(leftText, [{ text: title, url }, { text: rightText }, ...result])
}

function userLine(command) {
  const splitted = command.split('')

  function blinkTimes(start, end) {
    return Math.ceil((end - start) / 500) + 2
  }

  let result = ''
  result += `<div class="user" style="animation: hidden ${clock()}ms;">root@adamzielonka.pro</div>`
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
    .map(line => {
      const sliced = parseText(line.text).filter(s => s.text)
      return `<li style="animation: hidden ${clock(line.time)}ms;">${
        sliced
          .map(s => (s.url ? `<a href="${s.url}">${s.text}</a>` : s.text || '&nbsp;'))
          .join('') || '&nbsp;'
      }</li>`
    })
  lines.pop()
  return lines.join('')
}

function runCommand(command) {
  return userLine(command) + lines(command)
}

const html =
  '<ul>' +
  runCommand('whoami') +
  runCommand('description') +
  userLine('') +
  lines('panic') +
  '</ul>'

replace({
  files: './build/index.html',
  from: /<links\/>/,
  to: html,
})
  .then(results => {
    if (results[0].hasChanged) console.log('Generated no-script section')
    else console.error('Not found <links/> tag')
  })
  .catch(error => {
    console.error('Error occurred:', error)
  })
