<script lang="ts">
  import type {ApiRecordFormat, PtrValue} from "../../types/records";
  import TTLEditor from "../TTLEditor.svelte";

  export let editItem: ApiRecordFormat<PtrValue>;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.name} size={Math.max(20, editItem.name.length + 2)} /></div>
{/if}
<div>Time-To-Live</div>
<TTLEditor bind:value={editItem.ttl} />
<div>Target</div>
<div><input type="text" class="code-font" bind:value={editItem.value.target} size={Math.max(20, editItem.value.target.length + 2)} /></div>
