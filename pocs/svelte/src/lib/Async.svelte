<script lang="ts">
  let data: any = null;
  let error: string | null = null;
  let loading = false;

  async function load() {
    loading = true;
    error = null;

    await new Promise(r => setTimeout(r, 800));

    if (Math.random() > 0.5) {
      error = 'random fail';
      loading = false;
      return;
    }

    data = { ok: true, ts: Date.now() };
    loading = false;
  }
</script>

<h2>Async Lab</h2>

<button on:click={load}>load</button>

{#if loading}
  <p>loading...</p>
{:else if error}
  <p>error {error}</p>
{:else if data}
  <p>{JSON.stringify(data)}</p>
{/if}
