<script lang="ts">
  import type {ApiRecordFormat, PtrValue} from "../../types/records";
  import {dnsSubdomain} from "../../utils/dns-subdomain";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import PtrCreate from "../create-domains/PtrCreate.svelte";

  export let item: RestItem<ApiRecordFormat<PtrValue>>;
  let editItem: ApiRecordFormat<PtrValue> = empty();

  function empty(): ApiRecordFormat<PtrValue> {
    return {
      name: item.data.name,
      type: item.data.type,
      ttl: item.data.ttl,
      value: {
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

    <ActionPopup name="Edit PTR Record" bind:show={editPopup} on:save={save}>
      <PtrCreate bind:editItem editMode={true} />

      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
    </ActionPopup>
  </td>
</tr>
