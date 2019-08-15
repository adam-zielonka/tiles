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
    this.isProcessing = false
    this.startCommand = ['whoami', 'description']

    setTimeout(this.start)
  }

  pushLine(line) {
    this.lines.push(line)
    window.scrollTo(0,document.body.scrollHeight)
  }

  async start() {
    this.isProcessing = true
    for (const command of this.startCommand) {
      this.pushLine({command:'', blink:true})
      const commandLine = this.lines[this.lines.length -1]
      for (const c of command) {
        await sleep(50)
        commandLine.command += c
      }
      await sleep(1000)
      commandLine.blink = false
  
      for (const line of commands[command]) {
        await sleep(line.time)
        this.pushLine(line)
      } 
    }
    this.isProcessing = false
    window.scrollTo(0,document.body.scrollHeight)
  }

  addCommand(command) {
    this.isProcessing = true
    this.pushLine({command})
    if(!command) {
      this.isProcessing = false
      setTimeout(() => window.scrollTo(0,document.body.scrollHeight))
    } else {
      setTimeout(() => this.process(command.split(/\s+/).filter(c => !!c)))
    }
  }

  async process(args) {
    const command = args.length ? args[0] : ''
    switch (command) {
    case 'whoami':
    case 'description':
      for (const line of commands[command]) {
        await sleep(line.time)
        this.pushLine(line)
      }
      break
    case 'clear':
    case 'cls':
      await sleep(50)
      this.lines.clear()
      break
    default:
      await sleep(400)
      this.pushLine({text: `Command '${command}' not found.`})
      break
    }
    this.isProcessing = false
    window.scrollTo(0,document.body.scrollHeight)
  }
}

decorate(Store, {
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
