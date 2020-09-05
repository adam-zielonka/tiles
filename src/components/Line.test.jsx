import React from 'react'
import { shallow } from 'enzyme'
import { Line, TextLine } from './Line'
import { CommandLine } from './CommandLine'

describe('<Line/>', () => {
  describe('<TextLine/>', () => {
    it('show line with simple text', () => {
      const wrapper = shallow(<TextLine>Text</TextLine>)
      expect(wrapper.text()).toEqual('Text')
      expect(wrapper.find('li').length).toEqual(1)
    })
    it('show line with links', () => {
      const wrapper = shallow(<TextLine>[title1](link1) [title2](link2)</TextLine>)
      expect(wrapper.text()).toEqual('title1 title2')
      expect(wrapper.find('a').length).toEqual(2)
      expect(wrapper.find('li').length).toEqual(1)
    })
    it('show empty line', () => {
      const wrapper = shallow(<TextLine></TextLine>)
      expect(wrapper.text()).toEqual('\u00a0')
      expect(wrapper.find('li').length).toEqual(1)
    })
  })

  describe('<Line/>', () => {
    const textData = [
      { text: 'test' },
      { text: '' },
      {},
      { text: null },
      { command: null },
    ]
    const commandsData = [
      { command: '' },
      { command: '', text: 'test' },
      { command: 'test' },
    ]

    textData.forEach((props) => {
      it(`show text line with value "${props.text}"`, () => {
        const wrapper = shallow(<Line {...props} />)
        expect(wrapper.containsMatchingElement(<TextLine>{props.text}</TextLine>)).toEqual(true)
      })
    })
    commandsData.forEach((props) => {
      it(`show command line with value "${props.command}"`, () => {
        const wrapper = shallow(<Line {...props}/>)
        expect(wrapper.containsMatchingElement(<CommandLine/>)).toEqual(true)
      })
    })
  })
  
})
