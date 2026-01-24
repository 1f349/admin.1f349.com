<script lang="ts">
  import type {ApiRecordFormat, SoaValue} from "../../types/records";

  export let editItem: ApiRecordFormat<SoaValue>;
  export let editMode: boolean;
</script>

<div>Name</div>
<div class="code-font">{editItem.name}</div>

<!--
<div>Master Nameserver</div>
<div><input type="text" class="code-font" bind:value={editItem.value.target} size={Math.max(20, editItem.value.target.length + 2)} /></div>

<div>Admin Mailbox</div>
<div><input type="text" class="code-font" bind:value={editItem.value.target} size={Math.max(20, editItem.value.target.length + 2)} /></div>
-->

<div>Refresh</div>
<div><input type="number" class="code-font" bind:value={editItem.value.refresh} /></div>
<div>Retry</div>
<div><input type="number" class="code-font" bind:value={editItem.value.retry} /></div>
<div>Expire</div>
<div><input type="number" class="code-font" bind:value={editItem.value.expire} /></div>
<div>Default Time-to-Live</div>
<div><input type="number" class="code-font" bind:value={editItem.value.minttl} /></div>
