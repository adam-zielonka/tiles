import { prepareText } from './input'

describe('Input utils', () => {
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
})
