import { Store } from './storeUtils'

class State extends Store {
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

export const state = new State()
