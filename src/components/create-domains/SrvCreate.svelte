<script lang="ts">
  import type {ApiRecordFormat, SrvValue} from "../../types/records";

  export let editItem: ApiRecordFormat<SrvValue>;
  export let editMode: boolean;
</script>

<div>
  SRV record names should be begin with the format <code>_SERVICE._PROTOCOL</code>
</div>
<div>
  For example: <code>_sip._tcp</code>
</div>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.name} size={Math.max(20, editItem.name.length + 2)} /></div>
{/if}
<div>Priority</div>
<div><input type="number" class="code-font" bind:value={editItem.value.priority} /></div>
<div>Weight</div>
<div><input type="number" class="code-font" bind:value={editItem.value.weight} /></div>
<div>Port</div>
<div><input type="number" class="code-font" bind:value={editItem.value.port} /></div>
<div>Target</div>
<div><input type="text" class="code-font" bind:value={editItem.value.target} size={Math.max(20, editItem.value.target.length + 2)} /></div>
