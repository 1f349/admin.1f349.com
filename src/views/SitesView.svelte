<script lang="ts">
  import PromiseLike from "../components/PromiseLike.svelte";
  import PromiseTable from "../components/PromiseTable.svelte";
  import RemoveIcon from "../icons/Remove.svelte";
  import {domainOption} from "../stores/domain-option";
  import {LOGIN} from "../utils/login";
  import {RestItem, RestTable} from "../utils/rest-table";

  const apiSiteHosting = import.meta.env.VITE_API_SITE_HOSTING;

  const table = new RestTable<Site>(apiSiteHosting, (item: Site) => item.domain);

  interface Site {
    domain: string;
    branches: string[];
  }

  function rowOrdering(rows: RestItem<Site>[], domain: string): RestItem<Site>[] {
    return rows.filter(x => domainFilter(x.data.domain, domain)).sort((a, b) => a.data.domain.localeCompare(b.data.domain));
  }

  function domainFilter(src: string, domain: string) {
    if (domain == "*") return true;
    let n = src.indexOf("/");
    if (n == -1) n = src.length;
    let p = src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

  async function deleteBranch(site: Site, branch: string) {
    let f = await LOGIN.clientRequest(apiSiteHosting, {
      method: "POST",
      body: JSON.stringify({submit: "delete-branch", site: site.domain, branch}),
    });
    if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
    table.reload();
  }

  async function resetSiteSecret(site: Site) {
    let f = await LOGIN.clientRequest(apiSiteHosting, {
      method: "POST",
      body: JSON.stringify({submit: "secret", site: site.domain}),
    });
    if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
    let fJson = await f.json();
    alert("New secret: " + fJson.secret);
  }

  domainOption.subscribe(() => table.reload());
</script>

<h1>Site Hosting</h1>

<div style="padding:8px;background-color:#bb7900;">
  Warning: This is currently still under development, however it DOES send updates to the real server
</div>

<PromiseTable value={table}>
  <tr slot="headers">
    <th>Domain</th>
    <th>Branches</th>
    <th>Action</th>
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
          <td colspan="100">Error loading row for {item.data.domain}: {reason}</td>
        </tr>

        <tr slot="ok" let:value>
          <td><a href="https://{value.data.domain}" target="_blank">{value.data.domain}</a></td>
          <td>
            <div class="branch-cell">
              {#each value.data.branches as branch}
                {#if branch == ""}
                  <div><a href="https://{value.data.domain}/?git_branch=main" target="_blank" class="main-or-master">main or master</a></div>
                {:else}
                  <div><a href="https://{value.data.domain}/?git_branch={branch}" target="_blank">{branch}</a></div>
                {/if}
                <div><button class="btn-trash" on:click={() => deleteBranch(value.data, branch)}><RemoveIcon /></button></div>
              {/each}
            </div>
          </td>
          <td><button class="btn-reset-secret" on:click={() => resetSiteSecret(value.data)}>Reset Secret</button></td>
        </tr>
      </PromiseLike>
    {/each}
  </svelte:fragment>
</PromiseTable>

<style lang="scss">
  @import "../values.scss";

  .branch-cell {
    display: grid;
    grid-template-columns: repeat(2, auto);
    justify-content: left;
    align-content: center;

    div a {
      display: block;
      height: 40px;
      line-height: 40px;
    }
  }

  .main-or-master {
    color: lightgreen;
  }

  .btn-trash {
    @include button-red-highlight;
  }

  .btn-reset-secret {
    @include button-red-box;
  }
</style>
