<script lang="ts">
  import { marked, Renderer } from 'marked'
  import { onMount } from 'svelte'
  import { LineType } from '../store/lines'
  import LinePrefix from './LinePrefix.svelte'

  export let line: LineType

  Renderer.prototype.paragraph = function (text) {
    return text + '\n'
  }

  onMount(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
</script>

<li>
  {#if line.command}
    <LinePrefix path={line.path} />
    {line.value}{#if line.blink}<span class="blink">_</span>{/if}
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
  .blink {
    color: #111;
    animation: blink 0.5s linear infinite;
  }

  @keyframes blink {
    0% {
      color: #aaa;
    }

    50% {
      color: #aaa;
    }

    50.01% {
      color: #111;
    }

    100% {
      color: #111;
    }
  }
</style>
