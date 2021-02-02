import React, { useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import { prepareText } from '../utils'
import { UserDomain, Path } from './Line'
import { store } from '../store'


export function InputText({ start, end, children }) {
  const { isSelection, preparedText } = prepareText({ text: children, start, end })
  
  return <>
    {preparedText[0]}
    <span className={cx({selection: isSelection, caret: !isSelection})}>
      {preparedText[1]}
    </span>
    {preparedText[2]}
  </>
}

export const Input = observer(({inputRef}) => {
  const { value, setValue, historyUp, historyDown, addHistory } = store.history
  const { addCommand } = store
  const [focus, setFocus] = useState(false)
  const [selection, setSelection] = useState({start:0,end:0})

  const onChangeHandler = (e) => {
    setValue(e.target.value)
    onSelectHandler(e)
  }

  const onKeyDownHandler = (e) => {
    if(e.key === 'Enter') {
      addCommand(value)
      addHistory()
    } else if(e.key === 'ArrowUp') {
      historyUp()
      onSelectHandler(e)
    } else if(e.key === 'ArrowDown') {
      historyDown()
      onSelectHandler(e)
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

export const InputLine = observer(() => {
  const { isProcessing, freeze } = store
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
