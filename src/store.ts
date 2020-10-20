import { createContext, useContext } from 'react'
import { makeAutoObservable } from 'mobx'
import { sleep, installCommands, requireCommands, isFontExist } from './utils.js'
import TerminalHistory from './store/TerminalHistory'

type Line = {
  time?: number
  text: string
  system?: string
}

type Command = {
  command: string
  blink?: boolean
}

type Commands = Record<string, Line[]>

class Store {
  lines: (Line | Command)[]
  toProcess: any[]
  isProcessing: boolean
  shutdown: boolean
  freeze: boolean
  font: string
  commands: Commands
  help: any[]
  startCommand: string[]
  history: TerminalHistory = new TerminalHistory()
  
  constructor() {
    makeAutoObservable(this)
    const { commands, help } = installCommands(requireCommands())
    this.commands = commands as Commands
    this.help = help
    this.lines = []
    this.toProcess = []
    this.isProcessing = false
    this.startCommand = process.env.NODE_ENV !== 'production' ? [] : ['whoami', 'description']
    this.shutdown = false
    this.freeze = false
    this.font = ''

    setTimeout(this.start)
  }

  arrowUp = (lastCommand: string) => {
    return this.history.up(lastCommand)
  }

  arrowDown = () => {
    return this.history.down()
  }

  pushHistory = (line: Command) => {
    this.history.add(line.command)
  }

  pushLine = (line: Line | Command) => {
    this.lines.push(line)
    if ('command' in line) this.pushHistory(line)
    window.scrollTo(0,document.body.scrollHeight)
  }

  start = async () => {
    this.isProcessing = true
    for (const command of this.startCommand) {
      this.pushLine({command:'', blink:true})
      const commandLine = this.lines[this.lines.length -1] as Command
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

  addCommand = (command: string) => {
    this.isProcessing = true
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

  system = async (sysCommand: string,  { args }: any) => {
    switch (sysCommand) {
    case 'clear': this.lines.length = 0
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

  process = async (commandArgs: string[], stopProcess = true) => {
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

  setFont = (font: string) => {
    if(isFontExist(font) || !font) {
      this.font = `${font ? font + ', ' : ''}"Courier New", Courier, monospace`
      return true
    }
    return false
  }
}

const store = new Store()
const storeContext = createContext<Store>(store)
;(window as any).store = store

export function useStore(): Store {
  return useContext(storeContext)
}
