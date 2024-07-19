<script lang="ts">
  import type {TxtRecord} from "../../stores/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

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
  <td class="code-font">
    <span class="cutoff">{value.data.Txt.join("\n")}</span>
  </td>
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
      <div>Name</div>
      <div class="code-font">{editItem.Hdr.Name}</div>
      <div>Value</div>
      <div><input type="text" class="code-font" bind:value={editItem.Txt[0]} size={Math.max(20, editItem.Txt[0].length + 2)} /></div>
    </ActionPopup>
  </td>
</tr>
