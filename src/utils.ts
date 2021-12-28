export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export type CommandLine = {
  value: string
  time: number
  system?: string
  ui?: string
}

export function parseLines(body: string): CommandLine[] {
  const array = body.split('\n').map(m => m.replace(/^ *$/, ''))

  const defaults: CommandLine = { time: 20, value: '' }
  const lines: CommandLine[] = []
  let settings: CommandLine = { ...defaults }

  for (const text of array) {
    const [, namespace, action] = text.match(/^\[\]\((.*):(.*)\)$/) || []

    if (namespace === 'sleep') {
      settings.time = +action
    } else if (namespace === 'system') {
      settings.system = action
    } else if (namespace === 'ui') {
      settings.ui = action
    } else {
      lines.push({ ...settings, value: text })
      settings = { ...defaults }
    }
  }

  return lines
}
