<script lang="ts">
  import { counter, doubleCounter, debugCount, clock } from './stores';
</script>

<h2>Store Lab</h2>

<button on:click={() => counter.update(v => v + 1)}>
  counter {$counter}
</button>

<p>derived {$doubleCounter}</p>

<button on:click={() => debugCount.inc()}>
  debug {$debugCount}
</button>

<p>clock {$clock}</p>
