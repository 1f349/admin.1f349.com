<script lang="ts">
  import type {ApiRecordFormat, NsValue} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import NsCreate from "../create-domains/NsCreate.svelte";

  export let item: RestItem<ApiRecordFormat<NsValue>>;
  let editItem: ApiRecordFormat<NsValue> = {
    name: item.data.name,
    type: item.data.type,
    ttl: item.data.ttl,
    value: "",
  };

  let editPopup: boolean = false;
  export let locked: boolean = false;

  function save() {
    item.update(editItem);
  }
</script>

<tr>
  <td class="code-font">{item.data.name}</td>
  <td class="code-font">{item.data.value}</td>
  <td class="code-font">{item.data.ttl}</td>
  <td>
    {#if !locked}
      <ActionMenu
        data={item}
        edit={() => {
          editItem = JSON.parse(JSON.stringify(item.data));
          editPopup = true;
        }}
        remove={() => item.remove()}
      />
    {/if}

    <ActionPopup name="Edit SOA Record" bind:show={editPopup} on:save={save}>
      <NsCreate bind:editItem editMode={true} />
    </ActionPopup>
  </td>
</tr>
