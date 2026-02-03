<script lang="ts">
  import Reactive from './lib/Reactive.svelte';
  import Store from './lib/Store.svelte';
  import Lifecycle from './lib/Lifecycle.svelte';
  import Binding from './lib/Binding.svelte';
  import ContextParent from './lib/ContextParent.svelte';
  import BigList from './lib/BigList.svelte';
  import Async from './lib/Async.svelte';

  let showLife = true;
  let v = 0;
</script>

<h1>Svelte Deep POC</h1>

<Reactive />
<hr />
<Store />
<hr />
<Binding />
<hr />
<ContextParent />
<hr />
<Async />
<hr />
<BigList />
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
