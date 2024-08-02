<script lang="ts">
  import type {ApiRecordFormat, SrvValue} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import SrvCreate from "../create-domains/SrvCreate.svelte";

  export let item: RestItem<ApiRecordFormat<SrvValue>>;
  let editItem: ApiRecordFormat<SrvValue> = {
    name: item.data.name,
    type: item.data.type,
    ttl: item.data.ttl,
    value: {
      priority: 0,
      weight: 0,
      port: 0,
      target: "",
    },
  };

  let editPopup: boolean = false;

  function save() {
    item.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{item.data.name}</td>
  <td class="code-font">{item.data.value.priority}</td>
  <td class="code-font">{item.data.value.weight}</td>
  <td class="code-font">{item.data.value.port}</td>
  <td class="code-font">{item.data.value.target}</td>
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
      <SrvCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
