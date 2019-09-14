import React from 'react'
import { parseText } from '../utils/line'

export function TextLine({ children }) {
  return <li>
    {parseText(children ? children : '\u00a0').map((l, i) => <span key={i}>
      {l.url ? <a href={l.url}>{l.text}</a> : l.text}
    </span>)}
  </li>
}
