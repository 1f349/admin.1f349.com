<script lang="ts">
  import type {RestItem, RestTable} from "../utils/rest-table";
  import PromiseTable from "../components/PromiseTable.svelte";
  import PromiseLike from "../components/PromiseLike.svelte";
  import type {AnyRecord, AnyValue, ApiRecordFormat} from "../types/records";
  import ActionPopup from "../components/ActionPopup.svelte";

  type T = $$Generic<AnyValue>;

  export let recordName: string;
  export let table: RestTable<AnyRecord>;
  export let emptyRecord: (() => ApiRecordFormat<T>) | null;
  export let rowOrdering: (rows: RestItem<AnyRecord>[], isTRecord: (t: AnyRecord) => t is ApiRecordFormat<T>) => RestItem<ApiRecordFormat<T>>[];
  export let isTRecord: (t: AnyRecord) => t is ApiRecordFormat<T>;

  let createItem: ApiRecordFormat<T> | null = emptyRecord == null ? null : emptyRecord();
  let createPopup: boolean = false;
  let errorMessage: string | null = null;

  function createRecord() {
    if (createItem == null) return;

    // Trim and normalise record name
    createItem.name = createItem.name.trim();
    if (createItem.name == "") {
      createItem.name = "@";
    }

    table
      .addItem(createItem)
      .then(() => {
        createPopup = false;
      })
      .catch(x => {
        errorMessage = x;
      });
  }
</script>

<div class="row">
  <h2>{recordName} Records</h2>
  {#if emptyRecord != null && createItem != null}
    <button class="create-button" on:click={() => (createPopup = true)}>Create {recordName} Record</button>

    <ActionPopup name="Create {recordName} Record" bind:show={createPopup} on:save={createRecord}>
      <slot name="create" editItem={createItem} editMode={false} />

      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
    </ActionPopup>
  {/if}
</div>

<PromiseTable value={table}>
  <slot name="headers" slot="headers" />

  <svelte:fragment slot="rows" let:value>
    {#each rowOrdering(value.rows, isTRecord) as item}
      <PromiseLike value={item}>
        <tr slot="loading" class="empty-row">
          <td colspan="100">
            <div>Loading...</div>
          </td>
        </tr>

        <tr slot="error" let:reason class="empty-row">
          <td colspan="100">Error loading row for {item.data.name} ({item.data.id}): {reason}</td>
        </tr>

        <slot name="row" slot="ok" let:value {value} />
      </PromiseLike>
    {/each}
  </svelte:fragment>
</PromiseTable>

<style lang="scss">
  @import "../values.scss";

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .create-button {
    @include button-green-box;
  }
</style>
