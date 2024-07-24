<script lang="ts">
  import type {MxRecord} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import MxCreate from "../create-domains/MxCreate.svelte";

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

    <ActionPopup name="Edit MX Record" bind:show={editPopup} on:save={save}>
      <MxCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
