<script lang="ts">
  import type {ApiRecordFormat, SoaValue} from "../../types/records";
  import type {RestItem} from "../../utils/rest-table";
  import ActionMenu from "../ActionMenu.svelte";
  import ActionPopup from "../ActionPopup.svelte";

  export let item: RestItem<ApiRecordFormat<SoaValue>>;
  let editItem: ApiRecordFormat<SoaValue> = empty();

  function empty(): ApiRecordFormat<SoaValue> {
    return {
      name: item.data.name,
      type: item.data.type,
      ttl: item.data.ttl,
      value: {
        ns: "",
        mbox: "",
        serial: 0,
        refresh: 0,
        retry: 0,
        expire: 0,
        minttl: 0,
      },
    };
  }

  let editPopup: boolean = false;
  export let locked: boolean = false;
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

  function numLength(n: number) {
    return n.toString().length + 2;
  }
</script>

<tr>
  <td class="code-font">{item.data.name}</td>
  <td class="code-font">{item.data.value.mbox}</td>
  <td class="code-font">{item.data.value.minttl}</td>
  <td class="code-font">{item.data.value.refresh}</td>
  <td class="code-font">{item.data.value.retry}</td>
  <td class="code-font">{item.data.value.expire}</td>
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
      <div>Name</div>
      <div class="code-font">{item.data.name}</div>
      <div>Mailbox</div>
      <div><input type="text" class="code-font" bind:value={editItem.value.mbox} size={Math.max(20, editItem.value.mbox.length + 2)} /></div>
      <div>Minimum Time-to-Live</div>
      <div><input type="number" class="code-font" bind:value={editItem.value.minttl} size={Math.max(20, numLength(editItem.value.minttl))} /></div>
      <div>Refresh</div>
      <div><input type="number" class="code-font" bind:value={editItem.value.refresh} size={Math.max(20, numLength(editItem.value.refresh))} /></div>
      <div>Retry</div>
      <div><input type="number" class="code-font" bind:value={editItem.value.retry} size={Math.max(20, numLength(editItem.value.retry))} /></div>
      <div>Expire</div>
      <div><input type="number" class="code-font" bind:value={editItem.value.expire} size={Math.max(20, numLength(editItem.value.expire))} /></div>

      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
    </ActionPopup>
  </td>
</tr>
