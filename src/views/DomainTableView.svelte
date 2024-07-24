<script lang="ts">
  import {domainOption} from "../stores/domain-option";
  import type {RestItem, RestTable} from "../utils/rest-table";
  import PromiseTable from "../components/PromiseTable.svelte";
  import PromiseLike from "../components/PromiseLike.svelte";
  import type {AllRecords, UnknownRecord} from "../types/records";
  import ActionPopup from "../components/ActionPopup.svelte";

  type T = $$Generic<UnknownRecord>;

  export let recordName: string;
  export let table: RestTable<AllRecords>;
  export let emptyRecord: (() => any) | null;
  export let rowOrdering: (rows: RestItem<AllRecords>[], domain: string, isTRecord: (t: UnknownRecord) => t is T) => RestItem<T>[];
  export let isTRecord: (t: UnknownRecord) => t is T;

  let createItem: T | null = emptyRecord == null ? null : emptyRecord();
  let createPopup: boolean = false;

  function createRecord() {
    table.addItem(createItem as any);
  }
</script>

<div class="row">
  <h2>{recordName} Records</h2>
  {#if emptyRecord != null && createItem != null}
    <button class="create-button" on:click={() => (createPopup = true)}>Create {recordName} Record</button>

    <ActionPopup name="Create {recordName} Record" bind:show={createPopup} on:save={createRecord}>
      <slot name="create" editItem={createItem} editMode={false} />
    </ActionPopup>
  {/if}
</div>

<PromiseTable value={table}>
  <slot name="headers" slot="headers" />

  <svelte:fragment slot="rows" let:value>
    {#each rowOrdering(value.rows, $domainOption, isTRecord) as item}
      <PromiseLike value={item}>
        <tr slot="loading" class="empty-row">
          <td colspan="100">
            <div>Loading...</div>
          </td>
        </tr>

        <tr slot="error" let:reason class="empty-row">
          <td colspan="100">Error loading row for {item.data.Hdr.Name}: {reason}</td>
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
