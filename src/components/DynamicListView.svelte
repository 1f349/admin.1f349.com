<script lang="ts">
  import RemoveIcon from "../icons/Remove.svelte";

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

<div class="list-search">
  <input type="text" bind:value={addValue} />
  <button on:click={() => addItem()}>Add</button>
</div>

<div class="list-view">
  {#each list as item, i}
    <div class="list-item">
      <div class="content">{item}</div>
      <button class="remove" on:click={() => removeItem(i)}><RemoveIcon /></button>
    </div>
  {/each}
</div>

<style lang="scss">
  @import "../values.scss";

  .list-search {
    display: flex;
    flex-direction: row;
    gap: 8px;

    input {
      flex-grow: 1;
    }
  }

  .list-view {
    display: flex;
    flex-direction: column;

    .list-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .content {
        padding: 8px;
        font-family: monospace;
      }

      &:hover {
        background-color: #262626;
      }

      .remove {
        @include button-red-highlight;
      }
    }
  }
</style>
