<script lang="ts">
  import Reactive from './lib/Reactive.svelte';
  import Store from './lib/Store.svelte';
  import Lifecycle from './lib/Lifecycle.svelte';
  import Binding from './lib/Binding.svelte';
  import ContextParent from './lib/ContextParent.svelte';

  let showLife = true;
  let v = 0;
</script>

<h1>Svelte Deep POC</h1>

<Reactive />
<Store />
<Binding />
<ContextParent />

<hr />

<button on:click={() => showLife = !showLife}>
  toggle lifecycle
</button>

<button on:click={() => v++}>
  change prop
</button>

{#if showLife}
  <Lifecycle value={v} />
{/if}
