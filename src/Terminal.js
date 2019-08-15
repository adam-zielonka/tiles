import React, { useState, useRef } from 'react'
import { useStore } from './store'
import { observer } from 'mobx-react-lite'
import { slice } from './utils'

function User({user = 'root', domain = 'adamzielonka.pro', path = '~'}) {
  return <>
    <span className="user">{user}@{domain}</span>
    <span className="user-end">:{path}# </span>
  </>
}

function CommandLine({command, blink}) {
  return <li>
    <User/>
    {command}{blink ? <Caret/> : ''}
  </li>
}

function Caret() {
  return <span className='blink'>_</span>
}

const Input = observer(({inputRef}) => {
  const { addCommand } = useStore()
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)

  const onChangeHandler = (e) => {
    setValue(e.target.value)
  }

  const onKeyDownHandler = (e) => {
    if(e.key === 'Enter') {
      addCommand(value)
      setValue('')
    }
  }

  return <>
    {value}{focus ? <Caret/> : ''}
    <input
      ref={inputRef}
      className='input'
      autoFocus
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
      value={value}
    />
  </>
})

const InputCommandLine = observer(() => {
  const { isProcessing } = useStore()
  const inputRef = useRef(null)

  if(isProcessing) return ''

  const onClickHandler = () => {
    if(inputRef.current) inputRef.current.focus()
  }

  return <li onClick={onClickHandler}>
    <User/>
    <Input inputRef={inputRef}/>
  </li>
})

function TextLine({ text }) {
  let count = 0
  return <>
    {slice(text).map(l => <span key={count++} >
      {l.url ? <a href={l.url}>{l.text}</a> : l.text}
    </span>)}
  </>
}

function Line(line) {
  if(line.command || line.command === '') {
    return <CommandLine command={line.command} blink={line.blink}/>
  } else if(line.text) {
    return <li><TextLine text={line.text}/></li>
  } else {
    return <li>&nbsp;</li>
  }
}

function Terminal() {
  const { lines } = useStore()
  let counter = 0
  
  return <div>
    <ul>
      {lines.map(line => <Line key={counter++} {...line} />)}
      <InputCommandLine />
    </ul>
  </div>
}

export default observer(Terminal)
