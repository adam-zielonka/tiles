import { writable } from 'svelte/store'

export const path = writable('~')

export const cd = (newDir: string) => {
  path.update(dir => {
    if (newDir === '..') {
      const parts = dir.split('/')
      parts.pop()
      if (parts.length === 0 || parts[0] === '') {
        return '/'
      }
      return parts.join('/')
    } else if (newDir === '.') {
      return dir
    } else if (newDir === '~') {
      return '~'
    } else if (newDir.startsWith('/')) {
      return newDir
        .replace(/\/\//, '/')
        .replace(/.\/$/, '')
        .replace(/^\/root/, '~')
    } else {
      return `${dir}/${newDir}`
        .replace(/\/\//, '/')
        .replace(/.\/$/, '')
        .replace(/^\/root/, '~')
    }
  })
}
