import { createContext, useContext } from 'react'
import { decorate, observable, action } from 'mobx'
import { sleep, loadCommands, isFontExist } from './utils.js'


class Store {
  constructor() {
    const { commands, help } = loadCommands()
    this.commands = commands
    this.help = help
    this.lines = []
    this.toProcess = []
    this.isProcessing = false
    this.startCommand = ['whoami', 'description']
    this.history = []
    this.lastCommand = ''
    this.historyPosition = this.history.length
    this.shutdown = false
    this.freeze = false
    this.font = ''

    setTimeout(this.start)
  }

  arrowUp(lastCommand) {
    if(this.historyPosition === this.history.length) this.lastCommand = lastCommand
    if(this.historyPosition - 1 >= 0) {
      this.historyPosition -= 1
    }
    return this.history[this.historyPosition] ? this.history[this.historyPosition] : this.lastCommand
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
  
      await this.process([command], false)
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
      const args = [...command.matchAll(/["']([^"']*)["']| ?([^"' ]+) ?/g)].map(m => m[1] || m[2]).filter(c => !!c)
      if(!args.length) {
        this.isProcessing = false
        setTimeout(() => window.scrollTo(0,document.body.scrollHeight))
      } else {
        setTimeout(() => this.process(args.filter(c => !!c)))
      }
    }
  }

  async system(sysCommand,  {args}) {
    switch (sysCommand) {
    case 'clear': this.lines.clear()
      break
    case 'shutdown': this.shutdown = true
      break
    case 'freeze': this.freeze = true
      break
    case 'echo': this.lines.push({text: args.join(' ')})
      break
    case 'font':
      if(!this.setFont(args && args.length ? args.join(' ') : ''))
        this.pushLine({ text: `Font family '${args.join(' ')}' is not installed` })
      break
    case 'help':
      for (const line of this.help) {
        await sleep(20)
        const commands = line.alias ? [line.command, ...line.alias].join('|') : line.command
        const text = `${commands} - ${line.help}`
        this.pushLine({ text })
      }
      break
    default:
      break
    }
  }

  async process(commandArgs, stopProcess = true) {
    const [command, ...args] = commandArgs

    const lines = this.commands[this.commands[command] ? command : 'notFound']

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i]
      await sleep(line.time)
      if(line.system) await this.system(line.system, {args})
      else this.pushLine({...line, text: line.text.replace(/\[.*\]\(const:command\)/, command) })
    }
    await sleep(lines[lines.length - 1].time)

    if(stopProcess) this.isProcessing = false
    window.scrollTo(0,document.body.scrollHeight)
  }

  setFont(font) {
    if(isFontExist(font) || !font) {
      this.font = `${font ? font + ', ' : ''}"Courier New", Courier, monospace`
      return true
    }
    return false
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
  freeze: observable,
  font: observable,
  setFont: action.bound,
})

const store = createContext(new Store())

export function useStore() {
  return useContext(store)
}
