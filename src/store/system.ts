import { sleep } from '../utils'
import { getCommandLines, getHelpLines, LineType } from './commands'
import { START_COMMANDS } from './constants'
import { setFont } from './font'
import { clearLines, processCommandLine, processLine } from './lines'
import { cd } from './path'
import { setFreeze, setShutdown, startProcessing, stopProcessing } from './state'

const system = (sysCommand: string, args: string[]): LineType[] => {
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
      return [{ text: args.join(' '), time: 20 }]
    case 'font':
      return setFont(args.length ? args.join(' ') : '').map(text => ({
        text,
        time: 20,
      }))
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

const process = async (commandArgs: string) => {
  const [command, ...args] = parseArgs(commandArgs)
  if (!command) return

  for (const line of getCommandLines(command)) {
    if (line.system) {
      await sleep(line.time)
      for (const systemLine of system(line.system, args)) {
        await processLine(systemLine)
      }
    } else {
      await processLine(line)
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
