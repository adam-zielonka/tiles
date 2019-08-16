import React, { useState, useRef } from 'react'
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

function CaretText({text, selection, focus}) {
  if(!focus) return text

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
  const { addCommand, history } = useStore()
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [selection, setSelection] = useState({start:0,end:0})
  const [historyPosition, setHistoryPosition] = useState(history.length)

  const onChangeHandler = (e) => {
    setValue(e.target.value)
  }

  const onKeyDownHandler = (e) => {
    if(e.key === 'Enter') {
      addCommand(value)
      setValue('')
    } else if(e.key === 'ArrowUp') {
      if(historyPosition - 1 >= 0) {
        setHistoryPosition(historyPosition-1)
        setValue(history[historyPosition-1])
      }

    } else if(e.key === 'ArrowDown') {
      if(historyPosition + 1 <= history.length) {
        setHistoryPosition(historyPosition+1)
        if(historyPosition + 1 !== history.length) setValue(history[historyPosition+1])
        else setValue('')
      }

    }
  }

  const onSelectHandler = (e) => {
    setSelection({
      direction: e.target.selectionDirection,
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    })
  }

  return <>
    <CaretText focus={focus} text={value.replace(/ /g, '\u00a0')} selection={selection} />
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
