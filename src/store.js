import { createContext, useContext } from 'react'
import { decorate, observable, action } from 'mobx'
import links from './links.json'
import { sleep } from './utils.js'

const commands = {
  whoami: [
    { time: 1000, text: 'Adam Zielonka' },
    { time: 1000, text: '' },
    ...links.map(l => { return { time: 20, text: l }}),
    { time: 400, text: '' },
  ],
  description: [
    { time: 1000, text: '[PL] Człowiek programista. Informatyk' },
    { time: 10, text: '[EN] Programmerman. Computer scientist' },
    { time: 400, text: '' },
  ],
}

class Store {
  constructor() {
    this.lines = []
    this.toProcess = []
    this.isProcessing = true
    this.isStart = true
    this.startCommand = ['whoami', 'description']
  }

  async start() {
    this.isStart = false
    for (const command of this.startCommand) {
      this.lines.push({command:'', blink:true})
      const commandLine = this.lines[this.lines.length -1]
      for (const c of command) {
        await sleep(50)
        commandLine.command += c
      }
      await sleep(1000)
      commandLine.blink = false
  
      for (const line of commands[command]) {
        await sleep(line.time)
        this.lines.push(line)
      } 
    }
    this.isProcessing = false
  }

  addCommand(command) {
    this.isProcessing = true
    this.lines.push({command})
    if(!command) {
      this.isProcessing = false
    } else {
      setTimeout(() => this.process(command))
    }
  }

  async process(command) {
    switch (command) {
    case 'whoami':
    case 'description':
      for (const line of commands[command]) {
        await sleep(line.time)
        this.lines.push(line)
      }
      break
    default:
      await sleep(400)
      this.lines.push({text: `Command '${command}' not found.`})
      break
    }
    this.isProcessing = false
  }
}

decorate(Store, {
  isStart: observable,
  start: action.bound,
  lines: observable,
  toProcess: observable,
  isProcessing: observable,
  addCommand: action.bound,
  process: action.bound,
})

const store = createContext(new Store())

export function useStore() {
  return useContext(store)
}
