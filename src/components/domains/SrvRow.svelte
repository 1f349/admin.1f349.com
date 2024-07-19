<script lang="ts">
  import type {CnameRecord, SrvRecord} from "../../stores/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

  export let value: RestItem<SrvRecord>;
  let editItem: SrvRecord = {
    Hdr: {
      Name: "",
      Rrtype: 0,
      Class: 0,
      Ttl: 0,
    },
    Priority: 0,
    Weight: 0,
    Port: 0,
    Target: "",
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{value.data.Hdr.Name}</td>
  <td class="code-font">{value.data.Priority}</td>
  <td class="code-font">{value.data.Weight}</td>
  <td class="code-font">{value.data.Port}</td>
  <td class="code-font">{value.data.Target}</td>
  <td class="code-font">{value.data.Hdr.Ttl}</td>
  <td>
    <ActionMenu
      data={value}
      edit={() => {
        editItem = JSON.parse(JSON.stringify(value.data));
        editPopup = true;
      }}
      remove={() => value.remove()}
    />

    <ActionPopup name="Edit CNAME Record" bind:show={editPopup} on:save={save}>
      <div>Name</div>
      <div class="code-font">{editItem.Hdr.Name}</div>
      <div>Target</div>
      <div><input type="text" class="code-font" bind:value={editItem.Target} size={Math.max(20, editItem.Target.length + 2)} /></div>
    </ActionPopup>
  </td>
</tr>
