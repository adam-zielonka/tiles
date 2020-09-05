import React from 'react'
import { parseText } from '../utils/utils'

export function UserDomain({ user = 'root', domain = 'adamzielonka.pro' }) {
  return <span className="user">{user}@{domain}</span>
}

export function Path({ path = '~' }) {
  return <span className="path">:{path}# </span>
}

export function Caret({ blink = false }) {
  return blink ? <span className='blink'>_</span> : ''
}

export function CommandLine({ command = '', blink }) {
  return <li>
    <UserDomain/>
    <Path/>
    {command.replace(/ /g, '\u00a0')}
    <Caret blink={blink}/>
  </li>
}

export function TextLine({ children }) {
  return <li>
    {parseText(children || '\u00a0').map((l, i) => <span key={i}>
      {l.url ? <a href={l.url}>{l.text}</a> : l.text}
    </span>)}
  </li>
}

export function Line({ command, blink, text}) {
  if(command || command === '') {
    return <CommandLine command={command} blink={blink}/>
  }
  return <TextLine>{text}</TextLine>
}
