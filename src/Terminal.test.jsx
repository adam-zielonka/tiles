import React from 'react'
import { shallow } from 'enzyme'
import Terminal from './Terminal'
import { Shutdown } from './components/Shutdown'
import { Line } from './components/Line'

describe('<Terminal/>', () => {
  it('System is off', () => {
    window.store.shutdown = true
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.containsMatchingElement(<Shutdown/>)).toEqual(true)
  })

  it('System is on', () => {
    window.store.shutdown = false
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.text()).toEqual('')
  })

  it('System has lines', () => {
    window.store.lines.push({ command: 'echo test' })
    window.store.lines.push({ text: 'test' })
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.containsMatchingElement(<Line/>)).toEqual(true)
    expect(wrapper.text()).toEqual('<Line /><Line />')
  })
})
