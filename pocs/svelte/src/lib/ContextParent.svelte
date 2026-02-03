<script lang="ts">
  import { setContext } from 'svelte';
  import ContextChild from './ContextChild.svelte';

  const api = {
    say: () => alert('from context')
  };

  setContext('api', api);
</script>

<h2>Context Parent</h2>

<ContextChild />
