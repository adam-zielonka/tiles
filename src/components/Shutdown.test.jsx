import React from 'react'
import { shallow } from 'enzyme'
import { Shutdown } from './Shutdown'

describe('<Shutdown/>', () => {
  it('show correct exit text', () => {
    const wrapper = shallow(<Shutdown/>)
    expect(wrapper.text()).toEqual('It\'s now safe to turn offyour computer.')
  })
})
