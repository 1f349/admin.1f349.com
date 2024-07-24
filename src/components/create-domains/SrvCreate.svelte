<script lang="ts">
  import type {SrvRecord} from "../../types/records";

  export let editItem: SrvRecord;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.Hdr.Name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.Hdr.Name} size={Math.max(20, editItem.Hdr.Name.length + 2)} /></div>
{/if}
<div>Priority</div>
<div><input type="number" class="code-font" bind:value={editItem.Priority} /></div>
<div>Weight</div>
<div><input type="number" class="code-font" bind:value={editItem.Weight} /></div>
<div>Port</div>
<div><input type="number" class="code-font" bind:value={editItem.Port} /></div>
<div>Target</div>
<div><input type="text" class="code-font" bind:value={editItem.Target} size={Math.max(20, editItem.Target.length + 2)} /></div>
