<script lang="ts">
  import type {ApiRecordFormat, MxValue} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import MxCreate from "../create-domains/MxCreate.svelte";

  export let item: RestItem<ApiRecordFormat<MxValue>>;
  let editItem: ApiRecordFormat<MxValue> = {
    name: item.data.name,
    type: item.data.type,
    ttl: item.data.ttl,
    value: {
      mx: "",
      preference: 0,
    },
  };

  let editPopup: boolean = false;

  function save() {
    item.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{item.data.name}</td>
  <td class="code-font">{item.data.value.mx}</td>
  <td class="code-font">{item.data.value.preference}</td>
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

    <ActionPopup name="Edit MX Record" bind:show={editPopup} on:save={save}>
      <MxCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
