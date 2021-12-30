import { START_COMMANDS } from './constants'
import { SubscribableStore } from './storeUtils'

export class History extends SubscribableStore {
  private history: string[] = [...START_COMMANDS]
  private position = START_COMMANDS.length
  private temporaryValue = ''

  get value(): string {
    return this.history[this.position] || this.temporaryValue
  }

  get lastCommand(): string {
    return this.history[this.history.length - 1] || ''
  }

  setValue(value: string): void {
    this.position = this.history.length
    this.temporaryValue = value
  }

  addHistory(): void {
    if (this.value && this.value !== this.history[this.history.length - 1]) {
      this.history = [...this.history, this.value]
    }
    this.setValue('')
  }

  historyUp(): void {
    this.position - 1 >= 0 && --this.position
  }

  historyDown(): void {
    this.position + 1 <= this.history.length && ++this.position
  }
}
