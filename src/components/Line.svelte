<script lang="ts">
  import { marked, Renderer } from 'marked'
  import { onMount } from 'svelte'
  import { LineType } from '../store/lines'
  import Caret from './Caret.svelte'
  import LinePrefix from './LinePrefix.svelte'

  export let line: LineType

  Renderer.prototype.paragraph = text => text

  onMount(() => window.scrollTo(0, document.body.scrollHeight))
</script>

<li>
  {#if line.command}
    <LinePrefix path={line.path} />
    {line.value}{#if line.blink}<Caret />{/if}
  {:else}
    <span
      style={`color: ${line.style.color};` +
        `font-weight: ${line.style.fontWeight};` +
        `font-size: ${line.style.fontSize};`}
    >
      {@html marked(line.value || '\u00a0')}
    </span>
  {/if}
</li>

<style lang="scss">
  :global(a) {
    text-decoration: none;
    color: deepskyblue;
  }

  :global(a:hover) {
    text-decoration-line: underline;
  }
</style>
