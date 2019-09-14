import React from 'react'
import { shallow } from 'enzyme'
import { InputText, InputLine, Input } from './Input'
import { UserDomain, Path } from './CommandLine'

describe('<Input/>', () => {
  describe('<InputText/>', () => {
    describe('show input text with:', () => {
      it('show input text with caret on end', () => {
        const wrapper = shallow(<InputText start={4} end={4} >Text</InputText>)
        expect(wrapper.text()).toEqual('Text\u00a0')
      })
      it('show input text with caret on middle', () => {
        const wrapper = shallow(<InputText start={2} end={2} >Text</InputText>)
        expect(wrapper.text()).toEqual('Text')
      })
    })
  })

  describe('<InputLine/>', () => {
    it('show line with Input, Path and UserDomain', () => {
      const wrapper = shallow(<InputLine/>)
      expect(wrapper.containsMatchingElement(<UserDomain/>)).toEqual(true)
      expect(wrapper.containsMatchingElement(<Path/>)).toEqual(true)
      expect(wrapper.containsMatchingElement(<Input/>)).toEqual(true)
    })
  })
  //TODO: Input
})
