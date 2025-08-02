<script lang="ts">
  import {isARecord, type AaaaValue, type ApiRecordFormat, type AValue} from "../../types/records";
  import {dnsSubdomain} from "../../utils/dns-subdomain";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";
  import ACreate from "../create-domains/ACreate.svelte";

  export let item: RestItem<ApiRecordFormat<AValue | AaaaValue>>;
  let editItem: ApiRecordFormat<AValue & AaaaValue> = {
    name: item.data.name,
    type: item.data.type,
    ttl: item.data.ttl,
    value: {
      ip: "",
    },
  };

  let editPopup: boolean = false;
  let errorMessage: string | null = null;

  function save() {
    item
      .update(editItem)
      .then(() => {
        editPopup = false;
      })
      .catch(x => {
        errorMessage = x;
      });
  }
</script>

<tr>
  <td class="code-font">{dnsSubdomain(item.data.name)}</td>
  <td class="code-font">{item.data.value.ip}</td>
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

    <ActionPopup name="Edit {isARecord(item.data) ? 'A' : 'AAAA'} Record" bind:show={editPopup} on:save={save}>
      <ACreate bind:editItem editMode={true} />

      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
    </ActionPopup>
  </td>
</tr>
