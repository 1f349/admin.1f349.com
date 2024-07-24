<script lang="ts">
  import type {NsRecord} from "../../types/records";

  export let editItem: NsRecord;
  export let editMode: boolean;
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.Hdr.Name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.Hdr.Name} size={Math.max(20, editItem.Hdr.Name.length + 2)} /></div>
{/if}
<div>Nameserver</div>
<div><input type="text" class="code-font" bind:value={editItem.Ns} size={Math.max(20, editItem.Ns.length + 2)} /></div>
