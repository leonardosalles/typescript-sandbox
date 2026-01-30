<script lang="ts">
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';

  export let value: number;

  onMount(() => console.log('mount'));

  beforeUpdate(() => console.log('before update'));

  afterUpdate(() => console.log('after update'));

  onDestroy(() => console.log('destroy'));
</script>

<h2>Lifecycle value: {value}</h2>
