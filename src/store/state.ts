import { SubscribableStore } from './storeUtils'

export class State extends SubscribableStore {
  isProcessing = false
  shutdown = false
  freeze = false

  private setIsProcessing = (isProcessing: boolean): void => {
    this.isProcessing = isProcessing
  }

  startProcessing = (): void => {
    this.setIsProcessing(true)
  }

  stopProcessing = (): void => {
    this.setIsProcessing(false)
  }

  setShutdown = (): void => {
    this.shutdown = true
  }

  setFreeze = (): void => {
    this.freeze = true
  }
}
