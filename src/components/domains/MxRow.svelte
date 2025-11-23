<script lang="ts">
  import type {ApiRecordFormat, MxValue} from "../../types/records";
  import {dnsSubdomain} from "../../utils/dns-subdomain";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import MxCreate from "../create-domains/MxCreate.svelte";

  export let item: RestItem<ApiRecordFormat<MxValue>>;
  let editItem: ApiRecordFormat<MxValue> = empty();

  function empty(): ApiRecordFormat<MxValue> {
    return {
      name: item.data.name,
      type: item.data.type,
      ttl: item.data.ttl,
      value: {
        target: "",
        preference: 0,
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
  <td class="code-font">{item.data.value.preference}</td>
  <td class="code-font">{item.data.value.target}</td>
  <td class="code-font">{item.data.ttl ?? "Default"}</td>
  <td>
    <ActionMenu
      data={item}
      locked={item.isLocked()}
      edit={() => {
        editItem = JSON.parse(JSON.stringify(item.data));
        editPopup = true;
      }}
      remove={() => item.remove()}
    />

    <ActionPopup name="Edit MX Record" bind:show={editPopup} on:save={save}>
      <MxCreate bind:editItem editMode={true} />

      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
    </ActionPopup>
  </td>
</tr>
