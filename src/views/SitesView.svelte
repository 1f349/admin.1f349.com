<script lang="ts">
  import {domainOption} from "../stores/domain-option";
  import {getBearer} from "../stores/login";
  import {type Site, sitesTable} from "../stores/sites";
  import {apiRequest} from "../utils/api-request";

  const apiSiteHosting = import.meta.env.VITE_API_SITE_HOSTING;

  let tableKeys: string[] = [];
  $: tableKeys = Object.entries($sitesTable)
    .map(x => x[0])
    .filter(x => domainFilter(x, $domainOption))
    .sort((a, b) => a.localeCompare(b));

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
    let f = await apiRequest(apiSiteHosting);
    if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
    let fJson = await f.json();
    let rows = fJson as Site[];
    rows.forEach(x => {
      $sitesTable[x.domain] = x;
    });
  }

  async function deleteBranch(site: Site, branch: string) {
    let f = await apiRequest(apiSiteHosting, {
      method: "POST",
      body: JSON.stringify({submit: "delete-branch", site: site.domain, branch}),
    });
    if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
    promiseForTable = reloadTable();
  }

  async function resetSiteSecret(site: Site) {
    let f = await apiRequest(apiSiteHosting, {
      method: "POST",
      body: JSON.stringify({submit: "secret", site: site.domain}),
    });
    if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
    let fJson = await f.json();
    alert("New secret: " + fJson.secret);
  }
</script>

<div class="wrapper">
  <div style="padding:8px;background-color:#bb7900;">
    Warning: This is currently still under development, however it DOES send updates to the real server
  </div>

  <div class="scrolling-area">
    {#await promiseForTable}
      <div class="text-padding">
        <div>Loading...</div>
      </div>
    {:then}
      <table class="main-table">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Branches</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody class="invert-rows">
          {#each tableKeys as key (key)}
            {@const site = $sitesTable[key]}
            {@const domain = site.domain.replace(/[^0-9a-z-]/gi, "-")}
            <tr>
              <td><a href="https://{site.domain}" target="_blank">{site.domain}</a></td>
              <td>
                <div class="branch-cell">
                  {#each site.branches as branch}
                    {#if branch == ""}
                      <div><a href="https://{domain}_main.sites.1f349.com" target="_blank" class="main-or-master">main or master</a></div>
                    {:else}
                      <div><a href="https://{domain}_{branch}.sites.1f349.com" target="_blank">{branch}</a></div>
                    {/if}
                    <div><button on:click={() => deleteBranch(site, branch)}>Delete Branch</button></div>
                  {/each}
                </div>
              </td>
              <td><button on:click={() => resetSiteSecret(site)}>Reset Secret</button></td>
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
  .main-table {
    th,
    td {
      width: 1%;
    }
  }

  .branch-cell {
    display: grid;
    grid-template-columns: repeat(2, auto);
    justify-content: center;
    gap: 8px;
  }

  .main-or-master {
    color: lightgreen;
  }
</style>
