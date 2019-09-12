import React from 'react'

export function InputText({ start, end, children }) {
  const result = [
    children.slice(0, start),
    children.slice(start, end + 1),
    children.slice(end + 1),
  ]
  
  console.log(children, result)

  return <>
    {result[0]}
    <span>
      {result[1] ? result[1] : '\u00a0'}
    </span>
    {result[2]}
  </>
}

export function Input() {
  return <div>
    Input
  </div>
} 
