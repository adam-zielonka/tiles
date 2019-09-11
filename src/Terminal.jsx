import React, { useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import { useStore } from './store'
import { observer } from 'mobx-react-lite'
import { slice } from './utils'

function User({user = 'root', domain = 'adamzielonka.pro', path = '~'}) {
  return <>
    <span className="user">{user}@{domain}</span>
    <span className="path">:{path}# </span>
  </>
}

function CommandLine({command, blink}) {
  return <li>
    <User/>
    {command.replace(/ /g, '\u00a0')}{blink ? <Caret/> : ''}
  </li>
}

function Caret() {
  return <span className='blink'>_</span>
}

function CaretText({text, selection}) {
  const isSelection = selection.start !== selection.end 
  const end = isSelection ? selection.end : selection.end + 1

  const result = [
    text.slice(0, selection.start),
    text.slice(selection.start, end),
    text.slice(end),
  ]
   
  return <>
    {result[0]}
    <span className={cx({selection: isSelection, caret: !isSelection})}>
      {result[1] ? result[1] : <>&nbsp;</>}
    </span>
    {result[2]}
  </>
}

const Input = observer(({inputRef}) => {
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
    <CaretText text={value.replace(/ /g, '\u00a0')}  selection={selection} />
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
    <User/>
    <Input inputRef={inputRef}/>
  </li>
})

function TextLine({ text }) {
  let count = 0
  return <li>
    {slice(text).map(l => <span key={count++} >
      {l.url ? <a href={l.url}>{l.text}</a> : l.text}
    </span>)}
  </li>
}

function Line(line) {
  if(line.command || line.command === '') {
    return <CommandLine command={line.command} blink={line.blink}/>
  } else if(line.text) {
    return <TextLine text={line.text}/>
  } else {
    return <li>&nbsp;</li>
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
