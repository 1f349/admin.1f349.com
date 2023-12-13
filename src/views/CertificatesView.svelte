<script lang="ts">
  import {domainOption} from "../stores/domain-option";
  import {getBearer} from "../stores/login";
  import {type Cert, certsTable} from "../stores/certs";
  import {apiRequest} from "../utils/api-request";
  import {onMount} from "svelte";

  const apiOrchid = import.meta.env.VITE_API_ORCHID;

  let tableKeys: string[] = [];
  $: tableKeys = Object.entries($certsTable)
    .map(x => x[1])
    .filter(x => x.domains.map(x => domainFilter(x, $domainOption)).reduce((a, b) => a || b))
    .sort((a, b) => {
      // sort renew failed first
      if (a.renew_failed && b.renew_failed) return a.id - b.id;
      if (a.renew_failed) return -1;
      if (b.renew_failed) return 1;
      return a.id - b.id;
    })
    .map(x => x.id.toString());

  function domainFilter(src: string, domain: string) {
    if (domain == "*") return true;
    let n = src.indexOf("/");
    if (n == -1) n = src.length;
    let p = src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

  let promiseForTable: Promise<void> = reloadTable();

  async function reloadTable(): Promise<void> {
    let f = await apiRequest(apiOrchid + "/owned");
    if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
    let fJson = await f.json();
    let rows = fJson as Map<number, Cert>;
    Object.values(rows).forEach(x => {
      $certsTable[Object(x.id).toString()] = x;
    });
    console.log($certsTable);
  }
</script>

<div class="wrapper">
  <div style="padding:8px;background-color:#bb7900;">Warning: This is currently still under development</div>

  <div class="scrolling-area">
    {#await promiseForTable}
      <div class="text-padding">
        <div>Loading...</div>
      </div>
    {:then}
      <table class="main-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Auto Renew</th>
            <th>Active</th>
            <th>Renewing</th>
            <th>Renew Failed</th>
            <th>Not After</th>
            <th>Domains</th>
          </tr>
        </thead>
        <tbody class="invert-rows">
          {#each tableKeys as key (key)}
            {@const cert = $certsTable[key]}
            <tr class:cert-error={cert.renew_failed}>
              <td>{cert.id}</td>
              <td>{cert.auto_renew}</td>
              <td>{cert.active}</td>
              <td>{cert.renewing}</td>
              <td>{cert.renew_failed}</td>
              <td>
                <div>{cert.not_after}</div>
                <div>{Math.round((new Date(cert.not_after).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until expiry</div>
              </td>
              <td class="branch-cell">
                {#each cert.domains as domain}
                  <div>{domain}</div>
                {/each}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:catch err}
      <div class="text-padding">
        <div>Administrator... I hardly know her?</div>
        <div>{err}</div>
      </div>
    {/await}
  </div>
</div>

<style lang="scss">
  .branch-cell {
    display: grid;
    grid-template-columns: repeat(1, auto);
    justify-content: center;
    gap: 8px;
  }

  // css please explain yourself
  tr.cert-error.cert-error {
    &:nth-child(2n + 1) {
      background-color: #510000;
    }

    &:nth-child(2n) {
      background-color: #330000;
    }
  }
</style>
