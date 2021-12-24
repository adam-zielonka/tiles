<script lang="ts">
  import Input from './components/Input.svelte'
  import Line from './components/Line.svelte'
  import Shutdown from './components/Shutdown.svelte'
  import { font } from './store/font'
  import { lines } from './store/lines'
  import { freeze, isProcessing, shutdown } from './store/system'
</script>

{#if $shutdown}
  <Shutdown />
{:else}
  <div style={`font-family: ${$font}`}>
    <ul>
      {#each $lines as line}
        <Line value={line.text} command={line.command} blink={line.blink} />
      {/each}

      {#if !$isProcessing && !$freeze}
        <Input />
      {/if}
    </ul>
  </div>
{/if}

<style>
  div {
    float: left;
  }

  ul {
    list-style: none;
  }
</style>
