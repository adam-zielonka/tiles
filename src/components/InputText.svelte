<script lang="ts">
  export let value: string
  export let start: number
  export let end: number

  $: isSelection = start !== end
  $: newEnd = end + (isSelection ? 0 : 1)
  $: newValue = value.replace(/ /g, '\u00a0')

  $: beforText = newValue.slice(0, start)
  $: text = newValue.slice(start, newEnd) || '\u00a0'
  $: afterText = newValue.slice(newEnd)
</script>

{beforText}<span class={isSelection ? 'selection' : 'caret'}>{text}</span>{afterText}

<style>
  .selection,
  ::selection {
    background-color: #aaa;
    color: #111;
  }

  .caret {
    animation: blink-caret 0.5s linear infinite;
  }

  @keyframes blink-caret {
    0%,
    50% {
      text-decoration: underline;
    }
    50.01%,
    100% {
      text-decoration: none;
    }
  }
</style>
