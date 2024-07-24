<script lang="ts">
  import {isAaaaRecord, isARecord, type AaaaRecord, type ARecord} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import ACreate from "../create-domains/ACreate.svelte";

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

    <ActionPopup name="Edit {isARecord(value.data) ? 'A' : 'AAAA'} Record" bind:show={editPopup} on:save={save}>
      <ACreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
