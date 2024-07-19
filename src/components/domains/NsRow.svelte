<script lang="ts">
  import type {NsRecord} from "../../stores/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

  export let value: RestItem<NsRecord>;
  let editItem: NsRecord = {
    Hdr: {
      Name: "",
      Rrtype: 0,
      Class: 0,
      Ttl: 0,
    },
    Ns: "",
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{value.data.Hdr.Name}</td>
  <td class="code-font">{value.data.Ns}</td>
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
      <div>Nameserver</div>
      <div><input type="text" class="code-font" bind:value={editItem.Ns} size={Math.max(20, editItem.Ns.length + 2)} /></div>
    </ActionPopup>
  </td>
</tr>
