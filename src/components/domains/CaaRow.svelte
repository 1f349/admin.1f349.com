<script lang="ts">
  import type {CaaRecord} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import CaaCreate from "../create-domains/CaaCreate.svelte";

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

    <ActionPopup name="Edit CAA Record" bind:show={editPopup} on:save={save}>
      <CaaCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
