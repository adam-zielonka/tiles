/* eslint-disable no-console */
import fs from 'fs'
import replace from 'replace-in-file'
import { slice, getMappedLines } from './src/utils.js'

let time = 0

function updateTime(delay) {
  time += delay
  return time
}

function userLine(command) {
  const splitted = command.split('')

  function blinkTimes(time, time0) {
    return Math.ceil((time - time0)/500) + 2
  }

  let result = ''
  result += `<div class="user" style="animation: hidden ${updateTime(0)}ms;">root@adamzielonka.pro</div>`
  result += `<div class="user-end" style="animation: hidden ${updateTime(0)}ms;">:~#&nbsp;</div>`
  const time0 = time
  updateTime(1000)
  result += splitted.map(l => `<div class="user-end" style="animation: hidden ${updateTime(50)}ms;">${l}</div>`).join('')
  result += `<div class="blink" style="animation: blink 500ms linear ${time0}ms ${blinkTimes(time, time0)};">_</div>`
  updateTime(1000)
  return `<li>${result}</li>`
}

function lines(command) {
  let body = fs.readFileSync(`./src/commands/${command}.md`, 'utf8')
  if(!body) return ''
  body = body.replace(/---[ \s\S]*---\n/,'')

  const lines = getMappedLines(body).filter(f => !f.system).map(line => {
    const sliced = slice(line.text).filter(s => s.text)
    return `<li style="animation: hidden ${updateTime(line.time)}ms;">${sliced.map(s => s.url ? `<a href="${s.url}">${s.text}</a>` : (s.text || '&nbsp;') ).join('') || '&nbsp;'}</li>`
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

