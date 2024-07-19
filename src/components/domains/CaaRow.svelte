<script lang="ts">
  import type {CaaRecord} from "../../stores/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

  export let value: RestItem<CaaRecord>;
  let editItem: CaaRecord = {
    Hdr: {
      Name: "",
      Rrtype: 0,
      Class: 0,
      Ttl: 0,
    },
    Flag: 0,
    Tag: "",
    Value: "",
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{value.data.Hdr.Name}</td>
  <td class="code-font">{value.data.Tag}</td>
  <td class="code-font">{value.data.Value}</td>
  <td>
    <ActionMenu
      data={value}
      edit={() => {
        editItem = JSON.parse(JSON.stringify(value.data));
        editPopup = true;
      }}
      remove={() => value.remove()}
    />

    <ActionPopup name="Edit CAA Record" bind:show={editPopup} on:save={save}>
      <div>Name</div>
      <div class="code-font">{editItem.Hdr.Name}</div>
      <div>Tag</div>
      <div><input type="text" class="code-font" bind:value={editItem.Tag} size={Math.max(20, editItem.Tag.length + 2)} /></div>
      <div>Value</div>
      <div><input type="text" class="code-font" bind:value={editItem.Value} size={Math.max(20, editItem.Value.length + 2)} /></div>
    </ActionPopup>
  </td>
</tr>
