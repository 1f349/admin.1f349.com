<script lang="ts">
  import type {ApiRecordFormat, MxValue} from "../../types/records";

  export let editItem: ApiRecordFormat<MxValue>;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.name} size={Math.max(20, editItem.name.length + 2)} /></div>
{/if}
<div>Mail Server</div>
<div><input type="text" class="code-font" bind:value={editItem.value.target} size={Math.max(20, editItem.value.target.length + 2)} /></div>
<div>Preference</div>
<div><input type="number" class="code-font" bind:value={editItem.value.preference} /></div>
