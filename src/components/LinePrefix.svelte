<script lang="ts">
  const user = 'root'
  const domain = 'adamzielonka.pro'
  export let path = '~'
</script>

<span class="user">{user}@{domain}</span>:<span class="path">{path}</span>#

<style>
  .user {
    color: lawngreen;
  }
  .path {
    color: #f0f;
  }
</style>
