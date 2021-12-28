<script lang="ts">
  import { onMount } from 'svelte'

  export let index: number
  export let completions: string[]

  onMount(() => window.scrollTo(0, document.body.scrollHeight))
</script>

<li class="completions">
  {#each completions as completion, i}
    <div class={i === index ? 'active' : ''}>
      {completion}
    </div>
  {/each}
</li>

<style>
  .completions {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 10px;
  }

  .active {
    background-color: #aaa;
    color: #111;
  }
</style>
