<script lang="ts">
  import type {ApiRecordFormat, CaaValue} from "../../types/records";
  import {dnsSubdomain} from "../../utils/dns-subdomain";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import CaaCreate from "../create-domains/CaaCreate.svelte";

  export let item: RestItem<ApiRecordFormat<CaaValue>>;
  let editItem: ApiRecordFormat<CaaValue> = empty();

  function empty(): ApiRecordFormat<CaaValue> {
    return {
      name: item.data.name,
      type: item.data.type,
      ttl: item.data.ttl,
      value: {
        flag: 0,
        tag: "",
        value: "",
      },
    };
  }

  let editPopup: boolean = false;
  let errorMessage: string | null = null;

  function save() {
    item
      .update(editItem)
      .then(() => {
        editPopup = false;
        editItem = empty();
      })
      .catch(x => {
        errorMessage = x;
      });
  }
</script>

<tr>
  <td class="code-font">{dnsSubdomain(item.data.name)}</td>
  <td class="code-font">{item.data.value.tag}</td>
  <td class="code-font">{item.data.value.value}</td>
  <td class="code-font">{item.data.ttl ?? "Default"}</td>
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

      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
    </ActionPopup>
  </td>
</tr>
