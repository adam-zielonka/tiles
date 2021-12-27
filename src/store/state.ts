import { writable } from 'svelte/store'

export const isProcessing = writable(false)
export const shutdown = writable(false)
export const freeze = writable(false)

export function startProcessing() {
  isProcessing.set(true)
}

export function stopProcessing() {
  isProcessing.set(false)
}

export function setShutdown() {
  shutdown.set(true)
}

export function setFreeze() {
  freeze.set(true)
}
