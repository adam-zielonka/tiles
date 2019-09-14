import { parseText } from './line'

describe('Line utils', () => {
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
})
