import React from 'react'
import ReactDOM from 'react-dom'
import './index.styl'
import * as serviceWorker from './serviceWorker'
import Terminal from './Terminal'

ReactDOM.render(<Terminal />, document.getElementById('root'))

serviceWorker.unregister()
