<script lang="ts">
  import type {ApiRecordFormat, CnameValue} from "../../types/records";

  export let editItem: ApiRecordFormat<CnameValue>;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.name} size={Math.max(20, editItem.name.length + 2)} /></div>
{/if}
<div>Target</div>
<div><input type="text" class="code-font" bind:value={editItem.value} size={Math.max(20, editItem.value.length + 2)} /></div>
