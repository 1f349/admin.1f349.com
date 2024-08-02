<script lang="ts">
  import type {ApiRecordFormat, TxtValue} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import TxtCreate from "../create-domains/TxtCreate.svelte";
  import TdCutOff from "../CutOffTd.svelte";

  export let item: RestItem<ApiRecordFormat<TxtValue>>;
  let editItem: ApiRecordFormat<TxtValue> = {
    name: item.data.name,
    type: item.data.type,
    ttl: item.data.ttl,
    value: "",
  };

  let editPopup: boolean = false;

  function save() {
    item.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{item.data.name}</td>
  <TdCutOff class="code-font">{item.data.value}</TdCutOff>
  <td class="code-font">{item.data.ttl}</td>
  <td>
    <ActionMenu
      data={item}
      edit={() => {
        editItem = JSON.parse(JSON.stringify(item.data));
        editPopup = true;
      }}
      remove={() => item.remove()}
    />

    <ActionPopup name="Edit TXT Record" bind:show={editPopup} on:save={save}>
      <TxtCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
