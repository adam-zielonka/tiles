import autoBind from 'auto-bind'

export abstract class SubscribableStore {
  subscribers: Array<(value: typeof this) => void> = []

  constructor() {
    autoBind(this)
    setTimeout(() => makeAutoNotify(this))
  }

  subscribe(subscriber: (value: typeof this) => void): () => void {
    this.subscribers.push(subscriber)
    subscriber(this)
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== subscriber)
    }
  }

  notify(): void {
    this.subscribers.forEach(s => s(this))
  }
}

function proxyToArray(array: unknown[], notify: () => void): unknown[] {
  return new Proxy(array, {
    get(target, property): unknown {
      return target[property as unknown as number]
    },
    set(target, property, value): boolean {
      target[property as unknown as number] = value
      notify()
      return true
    },
  })
}

export function makeAutoNotify<T extends SubscribableStore>(self: T): void {
  const properties = Object.entries(self).filter(
    ([key, value]) => typeof value !== 'function' && key !== 'subscribers',
  )
  const record: Record<string, unknown> = {}

  for (const [key, value] of properties) {
    record[key] = Array.isArray(value) ? proxyToArray(value, () => self.notify()) : value

    Object.defineProperty(self, key, {
      set: (value: unknown) => {
        record[key] = Array.isArray(value)
          ? proxyToArray(value, () => self.notify())
          : value
        self.notify()
      },
      get: () => {
        return record[key]
      },
    })
  }
}
