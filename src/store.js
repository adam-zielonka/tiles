export const lines = [
  { time: 1000, user: true, line: 'whoami' },
  { time: 1000, line: 'Adam Zielonka' },
  { time: 1000, line: '' },
  { time: 0, line: '[EMAIL]' },
  { time: 0, line: '[root@adamzielonka.pro](mailto:root@adamzielonka.pro)' },
  { time: 0, line: '' },
  { time: 0, line: '[REPO]' },
  { time: 0, line: '[bitbucket.org/adam-zielonka-pro/](https://bitbucket.org/adam-zielonka-pro/)' },
  { time: 0, line: '' },
  { time: 0, line: '[APPS]' },
  { time: 0, line: 'Server Status: [Source](https://bitbucket.org/adam-zielonka-pro/server-status/src), [Demo](https://fake-status.adamzielonka.pro/)' },
  { time: 0, line: 'Unit Converter: [Google Play](https://play.google.com/store/apps/details?id=pro.adamzielonka.converter)' },
  { time: 0, line: 'paintAZ: [Source](https://bitbucket.org/adam-zielonka-pro/programowanie-wieloplatformowe-paint-qt/src)' },
  { time: 0, line: '' },
  { time: 0, line: '[GAMES]' },
  { time: 0, line: 'Ships: [Source](https://bitbucket.org/adam-zielonka-pro/jezyki-interpretowane/src), [Play](https://adamzielonka.pro/statki.html)' },
  { time: 0, line: 'GameOfLife: [Source](https://bitbucket.org/adam-zielonka-pro/jezyki-interpretowane/src/75a6444ff620f4c213af981301b585d872d70008/gameOfLife.html), [Play](https://adamzielonka.pro/gameOfLife.html)' },
  { time: 0, line: 'Pan: [Source](https://bitbucket.org/adam-zielonka-pro/pan/src), [Play](https://angular.adamzielonka.pro/)' },
  { time: 0, line: 'Chińczyk: [Source](https://bitbucket.org/adam-zielonka-pro/chinczyk/src), [Play](https://react.adamzielonka.pro/)' },
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
