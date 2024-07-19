<script lang="ts">
  import type {SoaRecord} from "../../stores/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

  export let value: RestItem<SoaRecord>;
  let editItem: SoaRecord = {
    Hdr: {
      Name: "",
      Rrtype: 0,
      Class: 0,
      Ttl: 0,
    },
    Ns: "",
    Mbox: "",
    Serial: 0,
    Refresh: 0,
    Retry: 0,
    Expire: 0,
    Minttl: 0,
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{value.data.Hdr.Name}</td>
  <td class="code-font">{value.data.Mbox}</td>
  <td class="code-font">{value.data.Minttl}</td>
  <td class="code-font">{value.data.Refresh}</td>
  <td class="code-font">{value.data.Retry}</td>
  <td class="code-font">{value.data.Expire}</td>
  <td>
    <ActionMenu
      data={value}
      edit={() => {
        editItem = JSON.parse(JSON.stringify(value.data));
        editPopup = true;
      }}
      remove={() => value.remove()}
    />

    <ActionPopup name="Edit SOA Record" bind:show={editPopup} on:save={save}>
      <div>Name</div>
      <div class="code-font">{editItem.Hdr.Name}</div>
      <div>Mailbox</div>
      <div><input type="text" class="code-font" bind:value={editItem.Mbox} size={Math.max(20, editItem.Mbox.length + 2)} /></div>
      <div>Minimum Time-to-Live</div>
      <div><input type="number" class="code-font" bind:value={editItem.Minttl} size={Math.max(20, editItem.Minttl.length + 2)} /></div>
      <div>Refresh</div>
      <div><input type="number" class="code-font" bind:value={editItem.Refresh} size={Math.max(20, editItem.Refresh.length + 2)} /></div>
      <div>Retry</div>
      <div><input type="number" class="code-font" bind:value={editItem.Retry} size={Math.max(20, editItem.Retry.length + 2)} /></div>
      <div>Expire</div>
      <div><input type="number" class="code-font" bind:value={editItem.Expire} size={Math.max(20, editItem.Expire.length + 2)} /></div>
    </ActionPopup>
  </td>
</tr>
