import React from 'react'
import { store } from './store'
import { observer } from 'mobx-react-lite'
import { Line } from './components/Line'
import { Shutdown } from './components/Shutdown'
import { InputLine } from './components/Input'

function Terminal() {
  const { lines, shutdown, font } = store

  if(shutdown) return <Shutdown />
  
  return <div style={{ fontFamily: font }}>
    <ul>
      {lines.map((line, index) => <Line key={index} {...line} />)}
      <InputLine/>
    </ul>
  </div>
}

export default observer(Terminal)
