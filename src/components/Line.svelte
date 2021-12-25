<script lang="ts">
  import { marked, Renderer } from 'marked'
  import LinePrefix from './LinePrefix.svelte'

  export let value: string
  export let command = false
  export let blink = false
  export let path = '~'

  Renderer.prototype.paragraph = function (text) {
    return text + '\n'
  }
</script>

<li>
  {#if command}
    <LinePrefix {path} />
    {value}{#if blink}<span class="blink">_</span>{/if}
  {:else}
    {@html marked(value || '\u00a0')}
  {/if}
</li>

<style lang="scss">
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
