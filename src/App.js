import React, { useEffect, useState } from 'react'
import './App.css'
import { getLine } from './store'

function User() {
  return <>
    <span className="user">root@adamzielonka.pro</span>
    <span className="user-end">:~# </span>
  </>
}

function Line({ user, line }) {
  return <li>
    {user ? <User /> : ''}
    {line ? <LineWithUrls line={line} />: <>&nbsp;</> }
  </li>
}

function slice(line) {
  let m = line.match(/\[(.*?)\]\((.*?)\)/)

  if(m) {
    const i = line.indexOf(m[0])

    return [
      { text: line.slice(0, i) },
      { text: m[1], url: m[2] },
      ...slice(line.slice(m[0].length + i, line.length))
    ]
  }

  return [{ text: line }]
}

function LineWithUrls({ line }) {
  let count = 0
  return <>
    {slice(line).map(l => <span key={count++} >
      {l.url ? <a href={l.url}>{l.text}</a> : l.text}
    </span>)}
  </>
}

const iterator = getLine()

function App() {
  const [list, setList] = useState([])

  useEffect(() => {
    const line = iterator.next()
    if(!line.done) setTimeout(() => {
      setList([...list, line.value])
    }, line.value.time)
  })

  let count = 0
  return (
    <div className="App">
      <ul>
        {list.map(line => <Line key={count++} {...line} />)}
      </ul>
    </div>
  )
}

export default App
