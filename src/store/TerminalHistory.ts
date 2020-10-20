export default class TerminalHistory {
  history: string[] = []
  position: number = 0
  temporaryValue: string = ''

  get value(): string {
    return this.history[this.position] || this.temporaryValue
  }

  add(value: string) {
    this.temporaryValue = ''
    if (value && value !== this.history[this.history.length - 1]) {
      this.history.push(value)
    }
    this.position = this.history.length
  }

  up(temporaryValue: string): string {
    if (this.position === this.history.length) this.temporaryValue = temporaryValue
    if (this.position - 1 >= 0) this.position -= 1
    return this.value
  }

  down(): string {
    if (this.position + 1 <= this.history.length) this.position += 1
    return this.value
  }
}
