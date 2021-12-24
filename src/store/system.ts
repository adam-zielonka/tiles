import { writable } from 'svelte/store'
import { sleep } from '../utils'
import { commands, help } from './commands'
import { START_COMMANDS } from './constants'
import { setFont } from './font'
import { clearLines, pushLine, updateLastLine } from './lines'

export const isProcessing = writable(false)
export const shutdown = writable(false)
export const freeze = writable(false)

export const startProcessing = () => {
  isProcessing.set(true)
}

export const stopProcessing = () => {
  isProcessing.set(false)
}

export const setShutdown = () => {
  shutdown.set(true)
}

export const setFreeze = () => {
  freeze.set(true)
}

const system = async (sysCommand: string, args: string[]) => {
  switch (sysCommand) {
    case 'clear':
      clearLines()
      break
    case 'shutdown':
      setShutdown()
      break
    case 'freeze':
      setFreeze()
      break
    case 'echo':
      pushLine({ text: args.join(' '), time: 20 })
      break
    case 'font':
      for (const text of setFont(args && args.length ? args.join(' ') : '')) {
        pushLine({ text, time: 20 })
      }
      break
    case 'help':
      for (const line of help) {
        if (!line.help) continue
        await sleep(20)
        const commands = line.alias
          ? [line.command, ...line.alias].join('|')
          : line.command
        const text = `${commands} - ${line.help}`
        pushLine({ text, time: 20 })
      }
      break
    default:
      break
  }
}

const process = async (commandArgs: string[], stopProcess = true) => {
  const [command, ...args] = commandArgs

  const lines = commands[commands[command] ? command : 'notFound']

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i]
    await sleep(line.time)
    if (line.system) {
      await system(line.system, args)
    } else
      pushLine({
        ...line,
        text: line.text.replace(/\[.*\]\(const:command\)/, command),
      })
  }
  await sleep(lines[lines.length - 1].time)

  if (stopProcess) stopProcessing()
  window.scrollTo(0, document.body.scrollHeight)
}

export const addCommand = (command: string) => {
  startProcessing()
  pushLine({ text: command, command: true, time: 20 })
  if (!command) {
    stopProcessing()
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight))
  } else {
    const args = [...command.matchAll(/["']([^"']*)["']| ?([^"' ]+) ?/g)]
      .map(m => m[1] || m[2])
      .filter(c => !!c)
    if (!args.length) {
      stopProcessing()
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight))
    } else {
      setTimeout(() => process(args.filter(c => !!c)))
    }
  }
}

const start = async () => {
  startProcessing()
  for (const command of START_COMMANDS) {
    const commandLine = pushLine({
      text: '',
      blink: true,
      command: true,
      time: 20,
    })
    for (const c of command) {
      await sleep(50)
      commandLine.text += c
      updateLastLine(commandLine)
    }
    await sleep(1000)
    commandLine.blink = false
    updateLastLine(commandLine)
    await process([command], false)
  }
  stopProcessing()
  window.scrollTo(0, document.body.scrollHeight)
}

setTimeout(start)
