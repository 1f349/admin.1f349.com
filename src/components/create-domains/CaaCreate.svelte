<script lang="ts">
  import type {CaaRecord} from "../../types/records";

  export let editItem: CaaRecord;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.Hdr.Name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.Hdr.Name} size={Math.max(20, editItem.Hdr.Name.length + 2)} /></div>
{/if}
<div>Tag</div>
<div><input type="text" class="code-font" bind:value={editItem.Tag} size={Math.max(20, editItem.Tag.length + 2)} /></div>
<div>Value</div>
<div><input type="text" class="code-font" bind:value={editItem.Value} size={Math.max(20, editItem.Value.length + 2)} /></div>
