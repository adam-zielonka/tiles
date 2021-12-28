import fs from 'fs'
import { replaceInFileSync } from 'replace-in-file'
import { marked, Renderer } from 'marked'
import { parseLines } from './utils'

Renderer.prototype.paragraph = function (text) {
  return text
}

function createClock() {
  return (
    (clock: number) =>
    (delay = 0) =>
      (clock += delay)
  )(0)
}

const clock = createClock()

clock(100)

function randomLetter() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function userLine(command: string) {
  const splitted = command.split('')

  function blinkTimes(start: number, end: number) {
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

function lines(command: string) {
  let body = fs.readFileSync(`./src/commands/${command}.md`, 'utf8')
  if (!body) return ''
  body = body.replace(/---[ \s\S]*---\n/, '')

  const lines = parseLines(body)
    .filter(f => !f.system)
    .map(
      line =>
        `<li style="animation: hidden ${clock(line.time)}ms;">${marked(
          line.value || '\u00a0',
        )}</li>`,
    )
  lines.shift()
  return lines.join('')
}

function runCommand(command: string) {
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

const results = replaceInFileSync({
  files: './dist/index.html',
  from: /<links \/>/g,
  to: html,
})

if (results[0]?.hasChanged) console.log('Generated no-script section')
else console.error('Not found <links/> tag')
