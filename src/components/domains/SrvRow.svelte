<script lang="ts">
  import type {ApiRecordFormat, SrvValue} from "../../types/records";
  import {dnsSubdomain} from "../../utils/dns-subdomain";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import SrvCreate from "../create-domains/SrvCreate.svelte";

  export let item: RestItem<ApiRecordFormat<SrvValue>>;
  let editItem: ApiRecordFormat<SrvValue> = empty();

  function empty(): ApiRecordFormat<SrvValue> {
    return {
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
  <td class="code-font">{item.data.value.priority}</td>
  <td class="code-font">{item.data.value.weight}</td>
  <td class="code-font">{item.data.value.port}</td>
  <td class="code-font">{item.data.value.target}</td>
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

    <ActionPopup name="Edit SRV Record" bind:show={editPopup} on:save={save}>
      <SrvCreate bind:editItem editMode={true} />

      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
    </ActionPopup>
  </td>
</tr>
