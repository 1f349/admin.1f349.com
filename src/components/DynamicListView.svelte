<script lang="ts">
  type T = $$Generic<Object>;

  export let list: T[];
  export let parser: (value: string) => T | null;
  let addValue: string = "";

  function addItem() {
    let item = parser(addValue);
    if (item == null) return;
    list.push(item);
    list = list;
    addValue = "";
  }

  function removeItem(index: number) {
    list.splice(index, 1);
    list = list;
  }
</script>

<div>
  <input type="text" bind:value={addValue} />
  <button on:click={() => addItem()}>Add</button>
</div>

<div>
  {#each list as item, i}
    <div>
      {item}
      <button on:click={() => removeItem(i)}>Remove</button>
    </div>
  {/each}
</div>
