import { sleep } from '../utils'
import { getCommandLines, getHelpLines } from './commands'
import { START_COMMANDS, STYLE_DEFAULTS } from './constants'
import { setFont } from './font'
import { clearLines, processCommandLine, processLine } from './lines'
import { cd } from './path'
import { setFreeze, setShutdown, startProcessing, stopProcessing } from './state'

const system = (sysCommand: string, args: string[]): string[] => {
  switch (sysCommand) {
    case 'clear':
      clearLines()
      return []
    case 'shutdown':
      setShutdown()
      return []
    case 'freeze':
      setFreeze()
      return []
    case 'echo':
      return [args.join(' ')]
    case 'font':
      return setFont(args.length ? args.join(' ') : '')
    case 'cd':
      cd(args.length ? args.join(' ') : '')
      return []
    case 'help':
      return getHelpLines()
    default:
      return []
  }
}

const parseArgs = (commandArgs: string): string[] => {
  return [...commandArgs.matchAll(/["']([^"']*)["']| ?([^"' ]+) ?/g)]
    .map(m => m[1] || m[2])
    .filter(c => !!c)
}

export type Style = {
  color: string
  fontWeight: string
  fontSize: string
}

const process = async (commandArgs: string) => {
  const [command, ...args] = parseArgs(commandArgs)
  if (!command) return

  const style: Style = { ...STYLE_DEFAULTS }

  for (const line of getCommandLines(command)) {
    if (line.system) {
      await sleep(line.time)
      for (const systemLine of system(line.system, args)) {
        await processLine({ value: systemLine, time: 20, style })
      }
    } else if (line.ui) {
      if (line.ui === 'color') {
        style.color = line.value
      } else if (line.ui === 'font-weight') {
        style.fontWeight = line.value
      } else if (line.ui === 'font-size') {
        style.fontSize = line.value
      } else if (line.ui === 'animate') {
        await processLine({ ...line, style }, true)
      }
    } else {
      await processLine({ ...line, style })
    }
  }
}

export const addCommand = async (command: string) => {
  startProcessing()
  await processCommandLine(command)
  await process(command)
  stopProcessing()
}

const start = async () => {
  startProcessing()
  for (const command of START_COMMANDS) {
    await processCommandLine(command, true)
    await process(command)
  }
  stopProcessing()
}

setTimeout(() => void start())
