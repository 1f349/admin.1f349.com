<script lang="ts">
  import type {CnameRecord} from "../../types/records";

  export let editItem: CnameRecord;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.Hdr.Name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.Hdr.Name} size={Math.max(20, editItem.Hdr.Name.length + 2)} /></div>
{/if}
<div>Target</div>
<div><input type="text" class="code-font" bind:value={editItem.Target} size={Math.max(20, editItem.Target.length + 2)} /></div>
