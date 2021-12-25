<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { value, addHistory, setValue, historyDown, historyUp } from '../store/history'
  import { addCommand } from '../store/system'
  import LinePrefix from './LinePrefix.svelte'
  import InputText from './InputText.svelte'
  import { path } from '../store/path'

  let input: HTMLInputElement
  let start = 0
  let end = 0

  const updateStartEnd = () => {
    start = input.selectionStart || 0
    end = input.selectionEnd || 0
  }

  function moveCaretToEnd() {
    setTimeout(() => {
      input.setSelectionRange(input.value.length, input.value.length)
      updateStartEnd()
    }, 10)
  }

  function keydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        addCommand($value)
        addHistory()
        break
      case 'ArrowUp':
        historyUp()
        moveCaretToEnd()
        break
      case 'ArrowDown':
        historyDown()
        moveCaretToEnd()
        break
    }

    input.focus()
    updateStartEnd()
  }

  function click() {
    input.focus()
    updateStartEnd()
  }

  onMount(() => {
    document.addEventListener('keydown', keydown)
    document.addEventListener('click', click)
    window.scrollTo(0, document.body.scrollHeight)
  })

  onDestroy(() => {
    document.removeEventListener('keydown', keydown)
    document.removeEventListener('click', click)
  })
</script>

<li>
  <LinePrefix path={$path} />
  <InputText value={$value} {start} {end} />
  <input
    value={$value}
    bind:this={input}
    on:select={updateStartEnd}
    on:keyup={updateStartEnd}
    on:keydown={updateStartEnd}
    on:keypress={updateStartEnd}
    on:change={updateStartEnd}
    on:input={e => {
      setValue(e.currentTarget.value)
      updateStartEnd()
    }}
  />
</li>

<style lang="scss">
  input {
    width: 1px;
    caret-color: #111;
    color: #111;
    border: none;
    padding: 0;
    background-color: #111;
    &:focus {
      outline: none;
    }
    &::selection {
      background-color: #111;
      color: #111;
      caret-color: #111;
    }
  }
</style>
