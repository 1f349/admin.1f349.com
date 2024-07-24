<script lang="ts">
  import type {TxtRecord} from "../../types/records";

  export let editItem: TxtRecord;
  export let editMode: boolean;

  function constrain(min: number, max: number, value: number) {
    return Math.min(max, Math.max(min, value));
  }
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.Hdr.Name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.Hdr.Name} size={Math.max(20, editItem.Hdr.Name.length + 2)} /></div>
{/if}
<div>Value</div>
<div><input type="text" class="code-font" bind:value={editItem.Txt[0]} size={constrain(20, 100, editItem.Txt[0].length + 2)} /></div>
