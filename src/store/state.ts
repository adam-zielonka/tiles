import { writable } from 'svelte/store'

export const isProcessing = writable(false)
export const shutdown = writable(false)
export const freeze = writable(false)

export const startProcessing = () => {
  isProcessing.set(true)
}

export const stopProcessing = () => {
  isProcessing.set(false)
}

export const setShutdown = () => {
  shutdown.set(true)
}

export const setFreeze = () => {
  freeze.set(true)
}
