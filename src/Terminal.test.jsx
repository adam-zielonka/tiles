import React from 'react'
import { shallow } from 'enzyme'
import { UserDomain, Path, CommandLine, Caret } from './NewTerminal'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('<UserDomain/>', () => {
  const data = [
    {user: 'root', domain: 'adamzielonka.pro'},
    {user: 'User', domain: 'Domain'},
  ]

  data.forEach((props) => {
    it(`returns logged user (${props.user}) and machine domain (${props.domain})`, () => {
      const wrapper = shallow(<UserDomain {...props} />)
      expect(wrapper.text()).toContain(`${props.user}@${props.domain}`)
    })
  })
  it('returns default logged user and default machine domain', () => {
    const wrapper = shallow(<UserDomain/>)
    expect(wrapper.text()).toContain('root@adamzielonka.pro')
  })
})

describe('<Path/>', () => {
  const paths = ['~', '/etc/']

  paths.forEach((path) => {
    it(`returns path (${path})`, () => {
      const wrapper = shallow(<Path path={path}/>)
      expect(wrapper.text()).toContain(`:${path}# `)
    })
  })
  it('returns default path', () => {
    const wrapper = shallow(<Path/>)
    expect(wrapper.text()).toContain(':~# ')
  })
})

describe('<Caret/>', () => {
  it('show caret`', () => {
    const wrapper = shallow(<Caret blink/>)
    expect(wrapper.text()).toEqual('_')
  })
  it('no show caret`', () => {
    const wrapper = shallow(<Caret blink={false}/>)
    expect(wrapper.text()).toEqual('')
  })
  it('no show caret with default param', () => {
    const wrapper = shallow(<Caret/>)
    expect(wrapper.text()).toEqual('')
  })
})

describe('<CommandLine/>', () => {
  it('show command line without command', () => {
    const wrapper = shallow(<CommandLine/>)
    expect(wrapper.containsMatchingElement(<UserDomain/>)).toEqual(true)
    expect(wrapper.containsMatchingElement(<Path/>)).toEqual(true)
    expect(wrapper.containsMatchingElement(<Caret/>)).toEqual(true)
  })
  it('show command line with command', () => {
    const wrapper = shallow(<CommandLine command='whoami'/>)
    expect(wrapper.containsMatchingElement(<UserDomain/>)).toEqual(true)
    expect(wrapper.containsMatchingElement(<Path/>)).toEqual(true)
    expect(wrapper.containsMatchingElement(<Caret/>)).toEqual(true)
    expect(wrapper.text()).toContain('whoami')
  })
  it('show command line with command and params', () => {
    const wrapper = shallow(<CommandLine command='whoami params'/>)
    expect(wrapper.containsMatchingElement(<UserDomain/>)).toEqual(true)
    expect(wrapper.containsMatchingElement(<Path/>)).toEqual(true)
    expect(wrapper.containsMatchingElement(<Caret/>)).toEqual(true)
    expect(wrapper.text()).toContain('whoami\u00a0params')
  })
})
