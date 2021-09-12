import React from 'react'
import { shallow } from 'enzyme'
import Terminal from './Terminal'
import { Shutdown } from './components/Shutdown'
import { Line } from './components/Line'
import { overrideStore, store } from './store'

describe('<Terminal/>', () => {
  it('System is off', () => {
    const store = overrideStore()
    store.shutdown = true
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.containsMatchingElement(<Shutdown/>)).toEqual(true)
  })

  it('System is on', () => {
    const store = overrideStore()
    store.shutdown = false
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.text()).toEqual('')
  })

  it('System has lines', () => {
    const store = overrideStore()
    store.lines = [{'command':'echo test'},{'text':'test'}]
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.containsMatchingElement(<Line/>)).toEqual(true)
    expect(wrapper.text()).toEqual('<Line /><Line />')
  })
})
