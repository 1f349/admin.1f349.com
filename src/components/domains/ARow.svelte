<script lang="ts">
  import {isAaaaRecord, isARecord, type AaaaRecord, type ARecord} from "../../stores/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

  export let value: RestItem<ARecord | AaaaRecord>;
  let editItem: ARecord & AaaaRecord = {
    Hdr: {
      Name: "",
      Rrtype: 0,
      Class: 0,
      Ttl: 0,
    },
    A: "",
    AAAA: "",
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{value.data.Hdr.Name}</td>
  <td class="code-font">{isARecord(value.data) ? value.data.A : isAaaaRecord(value.data) ? value.data.AAAA : ""}</td>
  <td>
    <ActionMenu
      data={value}
      edit={() => {
        editItem = JSON.parse(JSON.stringify(value.data));
        editPopup = true;
      }}
      remove={() => value.remove()}
    />

    <ActionPopup name="Edit {isARecord(value.data) ? 'A' : 'AAAA'} Record" bind:show={editPopup} on:save={save}>
      <div>Name</div>
      <div class="code-font">{editItem.Hdr.Name}</div>
      {#if isARecord(value.data)}
        <div>IPv4 Address</div>
        <div><input type="text" class="code-font" bind:value={editItem.A} size={Math.max(20, editItem.A.length + 2)} /></div>
      {:else if isAaaaRecord(value.data)}
        <div>IPv6 Address</div>
        <div><input type="text" class="code-font" bind:value={editItem.AAAA} size={Math.max(20, editItem.AAAA.length + 2)} /></div>
      {:else}
        <div>Pretty sure something is broken. WOMP WOMP!!</div>
      {/if}
    </ActionPopup>
  </td>
</tr>
