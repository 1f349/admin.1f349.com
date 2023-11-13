<script lang="ts">
  import {domainOption} from "../stores/domain-option";
  import {getBearer} from "../stores/login";
  import {type Site, sitesTable} from "../stores/sites";

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

  let promiseForTable: Promise<void> = Object.entries($sitesTable).length === 0 ? reloadTable() : Promise.resolve();

  function reloadTable(): Promise<void> {
    return new Promise<void>((res, rej) => {
      fetch(apiSiteHosting, {headers: {Authorization: getBearer()}})
        .then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
          return x.json();
        })
        .then(x => {
          let rows = x as Site[];
          rows.forEach(x => {
            $sitesTable[x.domain] = x;
          });
          res();
        })
        .catch(x => rej(x));
    });
  }

  function deleteBranch(site: Site, branch: string) {
    fetch(apiSiteHosting, {
      method: "POST",
      headers: {Authorization: getBearer()},
      body: JSON.stringify({submit: "delete-branch", site: site.domain, branch}),
    })
      .then(x => {
        if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        promiseForTable = reloadTable();
      })
      .catch(x => alert("Error deleting branch: " + x));
  }

  function resetSiteSecret(site: Site) {
    fetch(apiSiteHosting, {
      method: "POST",
      headers: {Authorization: getBearer()},
      body: JSON.stringify({submit: "secret", site: site.domain}),
    })
      .then(x => {
        if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        return x.json();
      })
      .then(x => {
        alert("New secret: " + x.secret);
      })
      .catch(x => alert("Error resetting secret: " + x));
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
            <tr>
              <td><a href="https://{$sitesTable[key].domain}" target="_blank">{$sitesTable[key].domain}</a></td>
              <td class="branch-cell">
                {#each $sitesTable[key].branches as branch}
                  <div>{branch}</div>
                  <div><button on:click={() => deleteBranch($sitesTable[key], branch)}>Delete Branch</button></div>
                {/each}
              </td>
              <td><button on:click={() => resetSiteSecret($sitesTable[key])}>Reset Secret</button></td>
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
    grid-template-columns: repeat(2, auto);
  }
</style>
