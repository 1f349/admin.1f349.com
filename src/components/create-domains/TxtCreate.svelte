<script lang="ts">
  import type {ApiRecordFormat, TxtValue} from "../../types/records";

  export let editItem: ApiRecordFormat<TxtValue>;
  export let editMode: boolean;

  function constrain(min: number, max: number, value: number) {
    return Math.min(max, Math.max(min, value));
  }
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.name} size={Math.max(20, editItem.name.length + 2)} /></div>
{/if}
<div>Value</div>
<div><input type="text" class="code-font" bind:value={editItem.value.value} size={constrain(20, 100, editItem.value.value.length + 2)} /></div>
