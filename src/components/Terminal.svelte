<script lang="ts">
  import Input from './Input.svelte'
  import Line from './Line.svelte'
  import Shutdown from './Shutdown.svelte'
  import { store } from '../store/store'

  const { state, font, lines } = store
</script>

{#if $state.shutdown}
  <Shutdown />
{:else}
  <div style={`font-family: ${$font.value}`}>
    <ul>
      {#each $lines.value as line}
        <Line {line} />
      {/each}

      {#if !$state.isProcessing && !$state.freeze}
        <Input />
      {/if}
    </ul>
  </div>
{/if}

<style>
  :global(html),
  :global(body) {
    position: relative;
    width: 100%;
    height: 100%;
  }

  :global(body) {
    background: #111;
    font: 16px/18px 'Courier New', Courier, monospace;
    color: #aaa;
    word-break: break-all;
    margin: 0;
    padding: 0;
  }

  div {
    float: left;
  }

  ul {
    list-style: none;
  }
</style>
