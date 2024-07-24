<script lang="ts">
  import type {TxtRecord} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import TxtCreate from "../create-domains/TxtCreate.svelte";
  import TdCutOff from "../CutOffTd.svelte";

  export let value: RestItem<TxtRecord>;
  let editItem: TxtRecord = {
    Hdr: {
      Name: "",
      Rrtype: 0,
      Class: 0,
      Ttl: 0,
    },
    Txt: [""],
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{value.data.Hdr.Name}</td>
  <TdCutOff class="code-font">{value.data.Txt.join("\n")}</TdCutOff>
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

    <ActionPopup name="Edit TXT Record" bind:show={editPopup} on:save={save}>
      <TxtCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
