import { writable } from 'svelte/store'

export const path = writable('~')

export const cd = (newDir: string) => {
  path.update(dir => {
    if (newDir.match(/^~/)) return newDir
    if (newDir.match(/^\//)) return newDir

    return dir + '/' + newDir
  })
}
