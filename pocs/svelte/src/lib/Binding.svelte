<script lang="ts">
  let name = '';
  $: upper = name.toUpperCase();
</script>

<h2>Binding Lab</h2>

<input bind:value={name} placeholder="type" />

<p>{name}</p>
<p>{upper}</p>
