<script lang="ts">
  let items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: i
  }));

  function updateOne() {
    const i = Math.floor(Math.random() * items.length);
    items[i].value++;
    items = items;
  }
</script>

<h2>Big List</h2>

<button on:click={updateOne}>update random</button>

{#each items as item (item.id)}
  <div>{item.id} — {item.value}</div>
{/each}
