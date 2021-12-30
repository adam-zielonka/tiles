<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { store } from '../store/store'
  import LinePrefix from './LinePrefix.svelte'
  import InputText from './InputText.svelte'
  import Completion from './Completion.svelte'

  const { history, commands, path, system } = store

  let input: HTMLInputElement
  let start = 0
  let end = 0

  let showCompletion = false
  let completionIndex = -1
  $: completions = commands.getCompletions($history.value)

  function updateStartEnd(): void {
    start = input.selectionStart || 0
    end = input.selectionEnd || 0
  }

  function moveCaretToEnd(): void {
    setTimeout(() => {
      input.setSelectionRange(input.value.length, input.value.length)
      updateStartEnd()
    }, 10)
  }

  function resetCompletion(): void {
    showCompletion = false
    completionIndex = -1
  }

  function keydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        if (completionIndex > -1 && completions[completionIndex]) {
          history.set(`${completions[completionIndex]} `)
          resetCompletion()
        } else {
          void system.addCommand($history.value)
          history.add()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        history.up()
        moveCaretToEnd()
        resetCompletion()
        break
      case 'ArrowDown':
        event.preventDefault()
        history.down()
        moveCaretToEnd()
        resetCompletion()
        break
      case 'Tab':
        event.preventDefault()
        if (completions.length === 1) {
          history.set(completions[0])
          moveCaretToEnd()
        }
        if (showCompletion) {
          completionIndex =
            completionIndex === -1 ? 0 : (completionIndex + 1) % completions.length
        } else {
          showCompletion = true
        }
        break
    }

    input.focus()
    updateStartEnd()
  }

  function click(): void {
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
  <LinePrefix path={$path.value} />
  <InputText value={$history.value} {start} {end} />
  <input
    value={$history.value}
    bind:this={input}
    on:select={updateStartEnd}
    on:keyup={updateStartEnd}
    on:keydown={updateStartEnd}
    on:keypress={updateStartEnd}
    on:change={updateStartEnd}
    on:input={e => {
      history.set(e.currentTarget.value)
      updateStartEnd()
    }}
  />
</li>

{#if showCompletion}
  <Completion {completions} index={completionIndex} />
{/if}

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
