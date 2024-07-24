<script lang="ts">
  import type {SrvRecord} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import SrvCreate from "../create-domains/SrvCreate.svelte";

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
      <SrvCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
