import links from './links.json'

export const lines = [
  { time: 1000, user: true, line: 'whoami' },
  { time: 1000, line: 'Adam Zielonka' },
  { time: 1000, line: '' },
  ...links.map(l => { return { time: 0, line: l }}),
  { time: 1000, user: true, line: 'description' },
  { time: 1000, line: '[PL] Człowiek programista. Informatyk' },
  { time: 0, line: '[EN] Programmerman. Computer scientist' },
  { time: 0, line: '' },
  { time: 1000, user: true, line: '' },
]

export function* getLine() {
  for (const line of lines) {
    yield line
  }
}
