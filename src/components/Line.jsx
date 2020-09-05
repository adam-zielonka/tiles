import React from 'react'
import { parseText } from '../utils/line'
import { CommandLine } from './CommandLine'

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
