import { makeAutoObservable } from 'mobx'

export default class InputHistory {
  private history: string[]
  private position: number
  private temporaryValue: string

  constructor(history: string[] = []) {
    makeAutoObservable(this)
    this.history = history
    this.position = history.length
    this.temporaryValue = ''
  }

  get value(): string {
    return this.history[this.position] || this.temporaryValue
  }

  setValue = (value: string) => {
    this.position = this.history.length
    this.temporaryValue = value
  }

  addHistory = () => {
    if (this.value && this.value !== this.history[this.history.length - 1]) {
      this.history.push(this.value)
    }
    this.setValue('')
  }

  historyUp = () => this.position - 1 >= 0 && --this.position

  historyDown = () => this.position + 1 <= this.history.length && ++this.position
}
