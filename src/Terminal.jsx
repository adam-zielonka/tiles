import React, { useState, useRef, useEffect } from 'react'
import { useStore } from './store'
import { observer } from 'mobx-react-lite'
import { InputText } from './components/Input'
import { CommandLine, UserDomain, Path } from './components/CommandLine'
import { TextLine } from './components/Line'

export const Input = observer(({inputRef}) => {
  const { addCommand, arrowUp, arrowDown } = useStore()
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [selection, setSelection] = useState({start:0,end:0})

  const onChangeHandler = (e) => {
    setValue(e.target.value)
    onSelectHandler(e)
  }

  const onKeyDownHandler = (e) => {
    if(e.key === 'Enter') {
      addCommand(value)
      setValue('')
    } else if(e.key === 'ArrowUp') {
      const valueUp = arrowUp(value)
      setValue(valueUp)
      setSelection({
        start: valueUp.length,
        end: valueUp.length,
      })
    } else if(e.key === 'ArrowDown') {
      const valueDown = arrowDown()
      setValue(valueDown)
      setSelection({
        start: valueDown.length,
        end: valueDown.length,
      })
    }
  }

  const onSelectHandler = (e) => {
    setSelection({
      direction: e.target.selectionDirection,
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    })
  }

  useEffect(() => {
    const onDocumentKeyDownHandler = (e) => {
      if(!focus && !['Control', 'Shift', 'Alt', 'AltGraph', 'CapsLock', 'Tab'].find(f => f === e.key)) {
        inputRef.current && inputRef.current.focus()
        onKeyDownHandler(e)
      }
    }
    document.addEventListener('keydown', onDocumentKeyDownHandler)
    return () => document.removeEventListener('keydown', onDocumentKeyDownHandler)
  })

  return <>
    <InputText {...selection}>{value.replace(/ /g, '\u00a0')}</InputText>
    <input
      ref={inputRef}
      className='input'
      autoFocus
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
      onSelect={onSelectHandler}
      value={value}
    />
  </>
})

const InputCommandLine = observer(() => {
  const { isProcessing, freeze } = useStore()
  const inputRef = useRef(null)

  if(isProcessing || freeze) return ''

  const onClickHandler = () => {
    if(inputRef.current) inputRef.current.focus()
  }

  return <li onClick={onClickHandler}>
    <UserDomain/>
    <Path/>
    <Input inputRef={inputRef}/>
  </li>
})

function Line(line) {
  if(line.command || line.command === '') {
    return <CommandLine command={line.command} blink={line.blink}/>
  } else {
    return <TextLine>{line.text}</TextLine>
  }
}

function Shutdown() {
  return <div className='shutdown'>
    <p>It{'\''}s now safe to turn off<br/>your computer.</p>
  </div>
}

function Terminal() {
  const { lines, shutdown } = useStore()

  if(shutdown) return <Shutdown />
  
  return <div>
    <ul>
      {lines.map((line, index) => <Line key={index} {...line} />)}
      <InputCommandLine />
    </ul>
  </div>
}

export default observer(Terminal)
