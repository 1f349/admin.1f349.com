<script lang="ts">
  import type {ApiRecordFormat, CaaValue} from "../../types/records";

  export let editItem: ApiRecordFormat<CaaValue>;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.name} size={Math.max(20, editItem.name.length + 2)} /></div>
{/if}
<div>Tag</div>
<div><input type="text" class="code-font" bind:value={editItem.value.tag} size={Math.max(20, editItem.value.tag.length + 2)} /></div>
<div>Value</div>
<div><input type="text" class="code-font" bind:value={editItem.value.value} size={Math.max(20, editItem.value.value.length + 2)} /></div>
