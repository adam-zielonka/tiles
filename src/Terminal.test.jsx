import React from 'react'
import { shallow } from 'enzyme'
import Terminal from './Terminal'
import { Shutdown } from './components/Shutdown'

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
})
