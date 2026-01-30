<script lang="ts">
  let count = 0;
  let obj = { value: 1 };
  let arr = [1, 2, 3];

  $: doubled = count * 2;
  $: objValue = obj.value;

  function mutateObject() {
    obj.value++;
  }

  function reassignObject() {
    obj = { ...obj, value: obj.value + 1 };
  }

  function pushArray() {
    arr.push(arr.length + 1);
  }

  function reassignArray() {
    arr = [...arr, arr.length + 1];
  }
</script>

<h2>Reactive Lab</h2>

<button on:click={() => count++}>count {count}</button>
<p>doubled {doubled}</p>

<p>objValue {objValue}</p>
<button on:click={mutateObject}>mutate object</button>
<button on:click={reassignObject}>reassign object</button>

<p>{arr.join(', ')}</p>
<button on:click={pushArray}>push</button>
<button on:click={reassignArray}>reassign</button>
