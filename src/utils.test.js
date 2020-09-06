import { parseCommand, parseText, prepareText, isFontExist } from './utils'

describe('Utils', () => {
  describe('parseCommand()', () => {
    it('return lines with 3 elements', () => {
      const body = ['[](sleep:500)','Testowy Text','','[](sleep:1000)',''].join('\n')
      const result = parseCommand(body)
      expect(result).toBeDefined()
      expect(result.length).toBe(3)
      expect(result).toStrictEqual(      [
        { time: 500, text: 'Testowy Text' },
        { time: 20, text: '' },
        { time: 1000, text: '' }
      ])
    })
    it('return lines and last command is form system api', () => {
      const body = ['[](sleep:50)','[](system:clear)', ''].join('\n')
      const result = parseCommand(body)
      expect(result).toBeDefined()
      expect(result.length).toBe(2)
      expect(result).toStrictEqual(      [
        { time: 50, text: '', system: 'clear' },
        { time: 20, text: '' },
      ])
    })
    it('return lines and last command is form system api without additional last line', () => {
      const body = ['[](system:shutdown)'].join('\n')
      const result = parseCommand(body)
      expect(result).toBeDefined()
      expect(result.length).toBe(2)
      expect(result).toStrictEqual(      [
        { time: 20, text: '', system: 'shutdown' },
        { time: 20, text: '' },
      ])
    })
    it('return one line if one empty lines', () => {
      const body = ''
      const result = parseCommand(body)
      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result).toStrictEqual([
        { time: 20, text: '' },
      ])
    })
    it('return two lines if two empty lines', () => {
      const body = ['', ''].join('\n')
      const result = parseCommand(body)
      expect(result).toBeDefined()
      expect(result.length).toBe(2)
      expect(result).toStrictEqual([
        { time: 20, text: '' },
        { time: 20, text: '' },
      ])
    })
  })

  describe('prepareText()', () => {
    const args = {
      text: 'Ala ma kota',
      start: 2,
      end: 2,
    }
    it('return isSelection and text array with 3 elements', () => {
      const result = prepareText(args)
      expect(result.preparedText.length).toBe(3)
      expect(result.isSelection).toBeDefined()
    })
    it('return isSelection is `false`, and second element in array is `a`', () => {
      const result = prepareText(args)
      expect(result.isSelection).toBe(false)
      expect(result.preparedText).toStrictEqual(['Al', 'a', ' ma kota'])
    })
    it('return isSelection is `true`, and second element in array is `a m`', () => {
      const result = prepareText({...args, end: 5})
      expect(result.isSelection).toBe(true)
      expect(result.preparedText).toStrictEqual(['Al', 'a m', 'a kota'])
    })
    it('return isSelection is `false`, and second element in array is hard space', () => {
      const result = prepareText({...args, start: 11, end: 11})
      expect(result.isSelection).toBe(false)
      expect(result.preparedText).toStrictEqual(['Ala ma kota', '\u00a0', ''])
    })
  })

  describe('parseText()', () => {
    const text = 'Links: [title1](link1), [title2](link2) this is it'

    it('return parsed text with links', () => {
      const result = parseText(text)
      expect(result).toStrictEqual([
        { text: 'Links: ' },
        { text: 'title1', 'url': 'link1' },
        { text: ', ' },
        { text: 'title2', 'url': 'link2' },
        { text: ' this is it' }
      ])
    })
  })

  describe('isFontExist()', () => {
    it('font function no crash', () => {
      expect(isFontExist('font name')).toBe(false)
      expect(isFontExist('font')).toBe(false)
      expect(isFontExist('')).toBe(false)
      expect(isFontExist()).toBe(false)
    })
  })
})

