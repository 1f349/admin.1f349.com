<script lang="ts" context="module">
  interface Target {
    src: string;
  }
</script>

<script lang="ts">
  import {TargetTable} from "../utils/target-table";

  import {domainOption} from "../stores/domain-option";
  import {RestItem} from "../utils/rest-table";
  import PromiseTable from "../components/PromiseTable.svelte";
  import PromiseLike from "../components/PromiseLike.svelte";

  type T = $$Generic<Target>;

  export let apiUrl: string;

  let table = new TargetTable<T>(apiUrl, (item: T) => item.src);

  function rowOrdering(rows: RestItem<T>[], domain: string): RestItem<T>[] {
    return rows.filter(x => domainFilter(x.data, domain)).sort((a, b) => a.data.src.localeCompare(b.data.src));
  }

  function domainFilter(item: T, domain: string): boolean {
    let n = item.src.indexOf("/");
    if (n == -1) n = item.src.length;
    let p = item.src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

  domainOption.subscribe(() => table.reload());
</script>

<div style="padding:8px;background-color:#bb7900;">
  Warning: This is currently still under development, however it DOES send updates to the real server
</div>

<PromiseTable value={table}>
  <tr slot="headers">
    <slot name="headers" />
  </tr>

  <svelte:fragment slot="rows" let:value>
    {#each rowOrdering(value.rows, $domainOption) as item}
      <PromiseLike value={item}>
        <tr slot="loading" class="empty-row">
          <td colspan="100">
            <div>Loading...</div>
          </td>
        </tr>

        <tr slot="error" let:reason class="empty-row">
          <td colspan="100">Error loading row for {item.data.src}: {reason}</td>
        </tr>

        <slot name="row" slot="ok" let:value {value} />
      </PromiseLike>
    {/each}
  </svelte:fragment>
</PromiseTable>
