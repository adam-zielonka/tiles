import { createContext, useContext } from 'react'
import { decorate, observable, action } from 'mobx'
import { sleep, loadCommands } from './utils.js'

class Store {
  constructor() {
    this.commands = loadCommands()
    this.lines = []
    this.toProcess = []
    this.isProcessing = false
    this.startCommand = ['whoami', 'description']
    this.history = []
    this.lastCommand = ''
    this.historyPosition = this.history.length
    this.shutdown = false

    setTimeout(this.start)
  }

  arrowUp(lastCommand) {
    if(this.historyPosition === this.history.length) this.lastCommand = lastCommand
    if(this.historyPosition - 1 >= 0) {
      this.historyPosition -= 1
    }
    return this.history[this.historyPosition]
  }

  arrowDown() {
    if(this.historyPosition + 1 <= this.history.length) {
      this.historyPosition += 1
    }
    if(this.historyPosition === this.history.length) return this.lastCommand
    return this.history[this.historyPosition]
  }

  pushHistory(line) {
    if(line.command && (!this.history.length || this.history[this.history.length-1] !== line.command)) {
      this.history.push(line.command)
    }
    this.historyPosition = this.history.length
  }

  pushLine(line) {
    this.lines.push(line)
    this.pushHistory(line)
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
      this.pushHistory(commandLine)
  
      for (const line of this.commands[command]) {
        await sleep(line.time)
        this.pushLine(line)
      } 
    }
    this.isProcessing = false
    window.scrollTo(0,document.body.scrollHeight)
  }

  addCommand(command) {
    this.isProcessing = true
    this.lastCommand = ''
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
    args.shift()
    switch (command) {
    case 'clear':
    case 'cls':
      await sleep(50)
      this.lines.clear()
      break
    case 'echo':
      await sleep(50)
      this.lines.push({text: args.join(' ')})
      break
    case 'shutdown':
    case 'exit':
      await sleep(50)
      this.pushLine({text: 'Wait ...'})
      await sleep(1000)
      this.lines.clear()
      await sleep(1000)
      this.shutdown = true
      break
    default:
      if(this.commands[command]) {
        for (const line of this.commands[command]) {
          await sleep(line.time)
          this.pushLine(line)
        }
      } else {
        await sleep(400)
        this.pushLine({text: `Command '${command}' not found.`})
        this.pushLine({text: 'Type \'help\' to find available commands'})
      }
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
  arrowUp: action.bound,
  arrowDown: action.bound,
  shutdown: observable,
})

const store = createContext(new Store())

export function useStore() {
  return useContext(store)
}
