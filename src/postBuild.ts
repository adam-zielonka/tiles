import fs from 'fs'
import { replaceInFileSync } from 'replace-in-file'
import { marked, Renderer } from 'marked'
import { parseLines } from './utils'

Renderer.prototype.paragraph = text => text

function createClock(clock = 0): (delay?: number) => number {
  return (delay = 0) => (clock += delay)
}

const clock = createClock()

function randomLetter(): string {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function split_map(text: string, fn: (letter: string) => string): string {
  return text.split('').map(fn).join('')
}

function renderLinePrefix(): string {
  return (
    split_map(
      'root@adamzielonka.pro',
      letter =>
        `<div class="user" style="animation: hidden ${clock()}ms;">${letter}</div>` +
        `<div class="hidden">${randomLetter()}</div>`,
    ) + `<div class="user-end" style="animation: hidden ${clock()}ms;">:~#&nbsp;</div>`
  )
}

function calculateBlinkCount(startTime: number, endTime: number): number {
  const blinkTime = 500
  return Math.ceil((endTime - startTime) / blinkTime) + 2
}

function renderCommandLine(command: string): string {
  const linePrefix = renderLinePrefix()
  const startTime = clock()

  clock(1000)

  const lineCommand = split_map(
    command,
    letter =>
      `<div class="user-end" style="animation: hidden ${clock(50)}ms;">${letter}</div>`,
  )
  const blinkTimes = calculateBlinkCount(startTime, clock())
  const caret = `<div class="blink" style="animation: blink 500ms linear ${startTime}ms ${blinkTimes};">_</div>`

  clock(1000)

  return `<li>${linePrefix}${lineCommand}${caret}</li>`
}

function renderLines(command: string): string {
  const body = fs
    .readFileSync(`./src/commands/${command}.md`, 'utf8')
    .replace(/---[ \s\S]*---\n/, '')

  const lines = parseLines(body)
    .filter(f => !f.system || !f.ui)
    .map(
      line =>
        `<li style="animation: hidden ${clock(line.time)}ms;">${marked(
          line.value || '&nbsp;',
        )}</li>`,
    )

  lines.shift()
  return lines.join('')
}

function renderCommand(command: string): string {
  return renderCommandLine(command) + renderLines(command)
}

const html =
  '<ul>' +
  renderCommand('whoami') +
  renderCommand('description') +
  renderCommandLine('') +
  renderLines('panic') +
  '</ul>'

function addIntent(line: string, level: number): string {
  return '  '.repeat(level) + line
}

function formatHtml(html: string): string {
  const textLines = html.replace(/((li)|(div)|(ul))>/g, '$1>\n').split('\n')
  let level = 3
  const lines = textLines.map(line => {
    if (line.match(/^.+<\//)) return addIntent(line, level)
    if (line.match(/^<\//)) return addIntent(line, --level)
    if (line.match(/\/>$/)) return addIntent(line, level)
    return addIntent(line, level++)
  })
  return lines.join('\n').trimStart()
}

const results = replaceInFileSync({
  files: './dist/index.html',
  from: /<links \/>/g,
  to: formatHtml(html),
})

if (results[0]?.hasChanged) console.log('Generated no-script section')
else console.error('Not found <links/> tag')
