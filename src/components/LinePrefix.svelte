<script lang="ts">
  const user = 'root'
  const domain = 'adamzielonka.pro'
  export let path = '~'
</script>

<span class="user">{user}@{domain}</span>:<span class="path">{path}</span>#

<style>
  span {
    font-weight: bold;
  }

  .user {
    color: lawngreen;
  }
  .path {
    color: #f0f;
  }
</style>
