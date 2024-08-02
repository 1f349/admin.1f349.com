<script lang="ts">
  import type {ApiRecordFormat, CaaValue} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import CaaCreate from "../create-domains/CaaCreate.svelte";

  export let item: RestItem<ApiRecordFormat<CaaValue>>;
  let editItem: ApiRecordFormat<CaaValue> = {
    name: item.data.name,
    type: item.data.type,
    ttl: item.data.ttl,
    value: {
      flag: 0,
      tag: "",
      value: "",
    },
  };

  let editPopup: boolean = false;

  function save() {
    item.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{item.data.name}</td>
  <td class="code-font">{item.data.value.tag}</td>
  <td class="code-font">{item.data.value.value}</td>
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

    <ActionPopup name="Edit CAA Record" bind:show={editPopup} on:save={save}>
      <CaaCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
