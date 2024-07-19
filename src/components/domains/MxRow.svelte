<script lang="ts">
  import type {MxRecord} from "../../stores/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

  export let value: RestItem<MxRecord>;
  let editItem: MxRecord = {
    Hdr: {
      Name: "",
      Rrtype: 0,
      Class: 0,
      Ttl: 0,
    },
    Mx: "",
    Preference: 0,
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{value.data.Hdr.Name}</td>
  <td class="code-font">{value.data.Mx}</td>
  <td class="code-font">{value.data.Preference}</td>
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
      <div>Mail Server</div>
      <div><input type="text" class="code-font" bind:value={editItem.Mx} size={Math.max(20, editItem.Mx.length + 2)} /></div>
      <div>Preference</div>
      <div><input type="text" class="code-font" bind:value={editItem.Preference} size={Math.max(20, editItem.Preference.length + 2)} /></div>
    </ActionPopup>
  </td>
</tr>
