<script lang="ts">
  import type {ApiRecordFormat, CnameValue} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import CnameCreate from "../create-domains/CnameCreate.svelte";

  export let item: RestItem<ApiRecordFormat<CnameValue>>;
  let editItem: ApiRecordFormat<CnameValue> = {
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
  <td class="code-font">{item.data.value}</td>
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

    <ActionPopup name="Edit CNAME Record" bind:show={editPopup} on:save={save}>
      <CnameCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
