import React from 'react'
import { shallow } from 'enzyme'
import { Line, TextLine, UserDomain, Path, Caret, CommandLine } from './Line'

describe('<Line/>', () => {
  describe('<CommandLine/>', () => {
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
        expect(wrapper.find('li').length).toEqual(1)
      })
      it('show command line with command', () => {
        const wrapper = shallow(<CommandLine command='whoami'/>)
        expect(wrapper.containsMatchingElement(<UserDomain/>)).toEqual(true)
        expect(wrapper.containsMatchingElement(<Path/>)).toEqual(true)
        expect(wrapper.containsMatchingElement(<Caret/>)).toEqual(true)
        expect(wrapper.text()).toContain('whoami')
        expect(wrapper.find('li').length).toEqual(1)
      })
      it('show command line with command and params', () => {
        const wrapper = shallow(<CommandLine command='whoami params'/>)
        expect(wrapper.containsMatchingElement(<UserDomain/>)).toEqual(true)
        expect(wrapper.containsMatchingElement(<Path/>)).toEqual(true)
        expect(wrapper.containsMatchingElement(<Caret/>)).toEqual(true)
        expect(wrapper.text()).toContain('whoami\u00a0params')
        expect(wrapper.find('li').length).toEqual(1)
      })
    })
  })  

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
