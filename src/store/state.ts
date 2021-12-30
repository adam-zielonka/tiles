import { SubscribableStore } from './storeUtils'

export class State extends SubscribableStore {
  isProcessing = false
  shutdown = false
  freeze = false

  startProcessing(): void {
    this.isProcessing = true
  }

  stopProcessing(): void {
    this.isProcessing = false
  }

  setShutdown(): void {
    this.shutdown = true
  }

  setFreeze(): void {
    this.freeze = true
  }
}
