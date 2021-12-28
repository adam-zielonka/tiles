import { writable, derived, get } from 'svelte/store'
import { START_COMMANDS } from './constants'

const history = writable<string[]>(START_COMMANDS)
const position = writable(START_COMMANDS.length)
const temporaryValue = writable('')

export const value = derived(
  [history, position, temporaryValue],
  ([$history, $position, $temporaryValue]) => $history[$position] || $temporaryValue,
)

export function setValue(value: string): void {
  position.set(get(history).length)
  temporaryValue.set(value)
}

export function addHistory(): void {
  history.update(_history => {
    const _value = get(value)
    if (_value && _value !== _history[_history.length - 1]) {
      return [..._history, _value]
    }
    return _history
  })
  setValue('')
}

export function historyUp(): void {
  position.update(_position => (_position - 1 >= 0 ? _position - 1 : _position))
}

export function historyDown(): void {
  position.update(_position =>
    _position + 1 <= get(history).length ? _position + 1 : _position,
  )
}
