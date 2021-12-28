import { writable } from 'svelte/store'

export const isProcessing = writable(false)
export const shutdown = writable(false)
export const freeze = writable(false)

export function startProcessing(): void {
  isProcessing.set(true)
}

export function stopProcessing(): void {
  isProcessing.set(false)
}

export function setShutdown(): void {
  shutdown.set(true)
}

export function setFreeze(): void {
  freeze.set(true)
}
