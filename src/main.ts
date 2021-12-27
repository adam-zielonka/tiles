const noscript = document.getElementById('noscript')
noscript && document.body.removeChild(noscript)

import './store/store'
import Terminal from './components/Terminal.svelte'

const app = new Terminal({
  target: document.body,
})

export default app
