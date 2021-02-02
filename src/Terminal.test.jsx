import React from 'react'
import { shallow } from 'enzyme'
import Terminal from './Terminal'
import { Shutdown } from './components/Shutdown'
import { Line } from './components/Line'
import { store } from './store'

describe('<Terminal/>', () => {
  it('System is off', () => {
    jest.spyOn(store, 'shutdown', 'get').mockReturnValue(true)
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.containsMatchingElement(<Shutdown/>)).toEqual(true)
  })

  it('System is on', () => {
    jest.spyOn(store, 'shutdown', 'get').mockReturnValue(false)
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.text()).toEqual('')
  })

  it('System has lines', () => {
    jest.spyOn(store, 'lines', 'get').mockReturnValue([{'command':'echo test'},{'text':'test'}])
    const wrapper = shallow(<Terminal/>)
    expect(wrapper.containsMatchingElement(<Line/>)).toEqual(true)
    expect(wrapper.text()).toEqual('<Line /><Line />')
  })
})
