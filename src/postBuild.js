/* eslint-disable no-console */
import fs from 'fs'
import replace from 'replace-in-file'
import { getMappedLines, parseText } from './utils.js'

const time = (time => delay => time += delay || 0)(0)

function userLine(command) {
  const splitted = command.split('')

  function blinkTimes(start, end) {
    return Math.ceil((end - start)/500) + 2
  }

  let result = ''
  result += `<div class="user" style="animation: hidden ${time()}ms;">root@adamzielonka.pro</div>`
  result += `<div class="user-end" style="animation: hidden ${time()}ms;">:~#&nbsp;</div>`
  const startTime = time()
  time(1000)
  result += splitted.map(l => `<div class="user-end" style="animation: hidden ${time(50)}ms;">${l}</div>`).join('')
  result += `<div class="blink" style="animation: blink 500ms linear ${startTime}ms ${blinkTimes(startTime, time())};">_</div>`
  time(1000)
  return `<li>${result}</li>`
}

function lines(command) {
  let body = fs.readFileSync(`./src/commands/${command}.md`, 'utf8')
  if(!body) return ''
  body = body.replace(/---[ \s\S]*---\n/,'')

  const lines = getMappedLines(body).filter(f => !f.system).map(line => {
    const sliced = parseText(line.text).filter(s => s.text)
    return `<li style="animation: hidden ${time(line.time)}ms;">${sliced.map(s => s.url ? `<a href="${s.url}">${s.text}</a>` : (s.text || '&nbsp;') ).join('') || '&nbsp;'}</li>`
  })
  lines.pop()
  return lines.join('')
}

function runCommand(command) {
  return userLine(command) + lines(command)
}

const html 
  = '<ul>'
  + runCommand('whoami') 
  + runCommand('description') 
  + userLine('')
  + lines('panic')
  + '</ul>'

replace({
  files: './build/index.html',
  from: /<links\/>/,
  to: html,
}).then(results => {
  if(results[0].hasChanged)
    console.log('Generated no-script section')
  else
    console.error('Not found <links/> tag')
}).catch(error => {
  console.error('Error occurred:', error)
})
