import React from 'react'

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
  return <>
    <UserDomain/>
    <Path/>
    {command.replace(/ /g, '\u00a0')}
    <Caret blink={blink}/>
  </>
}
