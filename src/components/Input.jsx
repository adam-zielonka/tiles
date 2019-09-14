import React from 'react'
import cx from 'classnames'
import { prepareText } from '../utils/input'

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

export function Input() {
  return <div>
    Input
  </div>
} 
