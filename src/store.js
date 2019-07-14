export const lines = [
  { time: 1000, user: true, line: 'whoami' },
  { time: 1000, line: 'Adam Zielonka' },
  { time: 1000, line: '' },
  { time: 0, line: '[EMAIL]' },
  { time: 0, line: '[root@adamzielonka.pro](mailto:root@adamzielonka.pro)' },
  { time: 0, line: '' },
  { time: 0, line: '[REPO]' },
  { time: 0, line: '[gitlab.com/adam-zielonka-pro](https://gitlab.com/adam-zielonka-pro)' },
  { time: 0, line: '[bitbucket.org/adam-zielonka-pro](https://bitbucket.org/adam-zielonka-pro)' },
  { time: 0, line: '' },
  { time: 0, line: '[APPS]' },
  { time: 0, line: 'Questions: [Source](https://gitlab.com/adam-zielonka-pro/questions), [Demo](https://questions.adamzielonka.pro/)' },
  { time: 0, line: 'Server Status: [Source](https://gitlab.com/adam-zielonka-pro/server-status), [Demo](https://fake-status.adamzielonka.pro/)' },
  { time: 0, line: 'Unit Converter: [Source](https://gitlab.com/adam-zielonka-pro/unit-converter), [Google Play](https://play.google.com/store/apps/details?id=pro.adamzielonka.converter)' },
  { time: 0, line: 'paintAZ: [Source](https://gitlab.com/adam-zielonka-pro/paintaz)' },
  { time: 0, line: '' },
  { time: 0, line: '[GAMES]' },
  { time: 0, line: 'Deska: [Source](https://gitlab.com/adam-zielonka-pro/pascal-games/deska), [Play](https://deska-pascal-game.adamzielonka.pro/)' },
  { time: 0, line: 'Saper: [Source](https://gitlab.com/adam-zielonka-pro/pascal-games/saper), [Play](https://saper-pascal-game.adamzielonka.pro/)' },
  { time: 0, line: 'Ships (Vanilla JS): [Source](https://gitlab.com/adam-zielonka-pro/statki-vanilla-js), [Play](https://statki-vanilla-js.adamzielonka.pro/)' },
  { time: 0, line: 'Ships (React JS): [Source](https://gitlab.com/adam-zielonka-pro/statki), [Play](https://statki.adamzielonka.pro/)' },
  { time: 0, line: 'GameOfLife: [Source](https://gitlab.com/adam-zielonka-pro/game-of-life), [Play](https://game-of-life.adamzielonka.pro/)' },
  { time: 0, line: 'Pan: [Source](https://gitlab.com/adam-zielonka-pro/pan), [Play](https://pan-game.adamzielonka.pro/)' },
  { time: 0, line: 'Chińczyk: [Source](https://gitlab.com/adam-zielonka-pro/chinczyk), [Play](https://chinczyk-game.adamzielonka.pro/)' },
  { time: 0, line: '' },
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
