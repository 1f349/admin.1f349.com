<script lang="ts">
  import PromiseLike from "../components/PromiseLike.svelte";
  import PromiseTable from "../components/PromiseTable.svelte";
  import {domainOption} from "../stores/domain-option";
  import {RestItem, RestTable} from "../utils/rest-table";

  const apiOrchid = import.meta.env.VITE_API_ORCHID;

  const table = new RestTable<Cert>(apiOrchid + "/certs", (item: Cert) => item.id.toString());

  interface Cert {
    id: number;
    auto_renew: boolean;
    active: boolean;
    renewing: boolean;
    renew_failed: boolean;
    not_after: string;
    updated_at: string;
    domains: string[];
  }

  function rowOrdering(rows: RestItem<Cert>[], domain: string): RestItem<Cert>[] {
    return rows
      .filter(x => x.data.domains.map(x => domainFilter(x, domain)).reduce((a, b) => a || b))
      .sort((a, b) => {
        // sort renew failed first
        if (a.data.renew_failed && b.data.renew_failed) return a.data.id - b.data.id;
        if (a.data.renew_failed) return -1;
        if (b.data.renew_failed) return 1;
        return a.data.id - b.data.id;
      });
  }

  function domainFilter(src: string, domain: string) {
    if (domain == "*") return true;
    let n = src.indexOf("/");
    if (n == -1) n = src.length;
    let p = src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

  domainOption.subscribe(() => table.reload());
</script>

<h1>Certificates</h1>

<div style="padding:8px;background-color:#bb7900;">Warning: This is currently still under development</div>

<PromiseTable value={table}>
  <tr slot="headers">
    <th>ID</th>
    <th>Auto Renew</th>
    <th>Active</th>
    <th>Renewing</th>
    <th>Renew Failed</th>
    <th>Not After</th>
    <th>Domains</th>
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
          <td colspan="100">Error loading row for {item.data.id}: {reason}</td>
        </tr>

        <tr slot="ok" let:value class:cert-error={value.data.renew_failed} class="empty-row">
          <td>{value.data.id}</td>
          <td>{value.data.auto_renew}</td>
          <td>{value.data.active}</td>
          <td>{value.data.renewing}</td>
          <td>{value.data.renew_failed}</td>
          <td>
            <div>{value.data.not_after}</div>
            <div>{Math.round((new Date(value.data.not_after).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until expiry</div>
          </td>
          <td class="branch-cell">
            {#each value.data.domains as domain}
              <div>{domain}</div>
            {/each}
          </td>
        </tr>
      </PromiseLike>
    {/each}
  </svelte:fragment>
</PromiseTable>

<style lang="scss">
  .branch-cell:last-child {
    display: grid;
    grid-template-columns: repeat(1, auto);
    justify-content: left;
    padding: 8px 15px;
  }

  .branch-cell {
    min-height: 40px;
    height: auto;
  }

  // css please explain yourself
  tr.cert-error.cert-error {
    &:nth-child(2n + 1) {
      background-color: #51000055;
    }

    &:nth-child(2n) {
      background-color: #33000055;
    }
  }
</style>
