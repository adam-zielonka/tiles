import autoBind from 'auto-bind'

export class SubscribableStore {
  subscribers: Array<(value: typeof this) => void> = []

  constructor() {
    setTimeout(() => {
      makeAutoNotify(this)
      autoBind(this)
    })
  }

  subscribe = (subscriber: (value: typeof this) => void): (() => void) => {
    this.subscribers.push(subscriber)
    subscriber(this)
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== subscriber)
    }
  }

  notify = (): void => {
    this.subscribers.forEach(s => s(this))
  }
}

export function makeAutoNotify<T extends SubscribableStore>(self: T): void {
  const properties = Object.entries(self).filter(
    ([key, value]) => typeof value !== 'function' && key !== 'subscribers',
  )
  const record: Record<string, unknown> = {}
  for (const [key, value] of properties) {
    record[key] = value
    Object.defineProperty(self, key, {
      set: (value: unknown) => {
        record[key] = value
        self.notify()
      },
      get: () => {
        return record[key]
      },
    })
  }
}
