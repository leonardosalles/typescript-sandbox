<script lang="ts">
  import Reactive from './lib/Reactive.svelte';
  import Store from './lib/Store.svelte';

  let v = 0;
</script>

<h1>Svelte Deep POC</h1>

<Reactive />
<Store />

<hr />

<button on:click={() => v++}>
  change prop
</button>
