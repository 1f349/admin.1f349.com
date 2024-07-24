<script lang="ts">
  import type {MxRecord} from "../../types/records";

  export let editItem: MxRecord;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.Hdr.Name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.Hdr.Name} size={Math.max(20, editItem.Hdr.Name.length + 2)} /></div>
{/if}
<div>Mail Server</div>
<div><input type="text" class="code-font" bind:value={editItem.Mx} size={Math.max(20, editItem.Mx.length + 2)} /></div>
<div>Preference</div>
<div><input type="number" class="code-font" bind:value={editItem.Preference} /></div>
