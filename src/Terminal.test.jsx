import React from 'react'
import { shallow } from 'enzyme'
import Terminal from './Terminal'
describe('<Terminal/>', () => {
  it('System is off', () => {
    window.store.shutdown = true
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.text()).toEqual('<Shutdown />')
  })
})
