import { sleep } from '../utils'
import { store } from './store'
import { SubscribableStore } from './storeUtils'

function system(sysCommand: string, args: string[]): string[] {
  switch (sysCommand) {
    case 'clear':
      store.lines.clear()
      return []
    case 'shutdown':
      store.system.setShutdown()
      return []
    case 'freeze':
      store.system.setFreeze()
      return []
    case 'echo':
      return [args.join(' ')]
    case 'font':
      return store.style.set(args.length ? args.join(' ') : '')
    case 'cd':
      store.path.cd(args.length ? args.join(' ') : '')
      return []
    case 'help':
      return store.commands.helpLines
    default:
      return []
  }
}

function parseArgs(commandArgs: string): string[] {
  return [...commandArgs.matchAll(/["']([^"']*)["']| ?([^"' ]+) ?/g)]
    .map(m => m[1] || m[2])
    .filter(c => !!c)
}

export class Style {
  color = ''
  fontWeight = ''
  fontSize = ''
}

async function process(commandArgs: string): Promise<void> {
  const [command, ...args] = parseArgs(commandArgs)
  if (!command) {
    return
  }

  const style: Style = new Style()

  for (const line of store.commands.getLines(command)) {
    let animate = false
    let hide = false

    for (const action of line.actions) {
      switch (action.namespace) {
        case 'sleep':
          await sleep(+action.action)
          continue
        case 'system':
          for (const systemLine of system(action.action, args)) {
            await store.lines.processLine({ value: systemLine, style })
          }
          continue
        case 'ui':
          if (action.action === 'color') {
            style.color = action.value
          } else if (action.action === 'font-weight') {
            style.fontWeight = action.value
          } else if (action.action === 'font-size') {
            style.fontSize = action.value
          } else if (action.action === 'animate') {
            animate = true
          } else if (action.action === 'hide') {
            hide = true
          }
          continue
      }
    }

    !hide && (await store.lines.processLine({ value: line.value, style }, animate))
  }
}

export class System extends SubscribableStore {
  private state: 'processing' | 'shutdown' | 'freeze' | '' = ''

  get shutdown(): boolean {
    return this.state === 'shutdown'
  }

  get isInputAllowed(): boolean {
    return !['freeze', 'processing'].includes(this.state)
  }

  startProcessing(): void {
    this.state = 'processing'
  }

  stopProcessing(): void {
    if (this.state === 'processing') {
      this.state = ''
    }
  }

  setShutdown(): void {
    this.state = 'shutdown'
  }

  setFreeze(): void {
    this.state = 'freeze'
  }

  async addCommand(command: string): Promise<void> {
    store.system.startProcessing()
    await store.lines.processCommandLine(command)
    await process(command)
    store.system.stopProcessing()
  }

  async start(startCommands: string[]): Promise<void> {
    store.system.startProcessing()
    for (const command of startCommands) {
      store.history.set(command)
      store.history.add()
      await store.lines.processCommandLine(command, true)
      await process(command)
    }
    store.system.stopProcessing()
  }
}
