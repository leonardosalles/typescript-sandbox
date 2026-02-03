<script lang="ts">
  import { getContext } from 'svelte';

  const api = getContext<{ say: () => void }>('api');
</script>

<button on:click={api.say}>
  call context
</button>
