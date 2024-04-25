<script lang="ts" context="module">
  interface Target {
    src: string;
  }
</script>

<script lang="ts">
  import {LOGIN} from "../utils/login";
  import {writable, type Writable} from "svelte/store";
  import type {CSPair} from "../types/cspair";
  import {domainOption} from "../stores/domain-option";
  import {type CountStats, tableCountStats} from "../stores/target";

  type T = $$Generic<Target>;

  export let apiUrl: string;
  export let tableData: Writable<{[key: string]: CSPair<T>}>;
  export let equality: (a: T | null, b: T | null) => boolean;

  let tableSearch: string = "";

  let tableKeys: string[] = [];
  $: tableKeys = Object.entries($tableData)
    .filter(x => x[1].client != null || x[1].server != null)
    .map(x => x[0])
    .filter(x => domainFilter(x, $domainOption))
    .filter(x => x.includes(tableSearch))
    .sort((a, b) => a.localeCompare(b));

  let rowStats: CountStats = {created: 0, modified: 0, removed: 0};
  $: rowStats = tableCountStats($tableData, tableKeys, equality);

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
    let f = await LOGIN.clientRequest(apiUrl, {}, false);
    if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
    let fJson = await f.json();

    let rows = fJson as T[];
    let srcs = new Set(Object.keys($tableData));
    rows.forEach(x => {
      $tableData[x.src] = {
        client: !$tableData[x.src] ? JSON.parse(JSON.stringify(x)) : $tableData[x.src]?.client,
        server: x,
        p: Promise.resolve(),
      };
      srcs.delete(x.src);
    });
    srcs.forEach(x => {
      $tableData[x].server = null;
    });
  }

  interface Savable<T> {
    type: "del" | "ins";
    v: CSPair<T>;
  }

  function saveChanges() {
    let tableProm = tableKeys
      .map(x => $tableData[x])
      .filter(x => x.client != null || x.server != null)
      .filter(x => !equality(x.client, x.server))
      .map((x: CSPair<T>): Savable<T> => {
        if (x.client == null && x.server != null) return {type: "del", v: x};
        return {type: "ins", v: x};
      })
      .sort((a, _) => (a.type === "del" ? -1 : a.type === "ins" ? 1 : 0))
      .map(x => {
        x.v.p = LOGIN.clientRequest(
          apiUrl,
          {
            method: x.type == "del" ? "DELETE" : "POST",
            body: JSON.stringify(x.type == "del" ? {src: (x.v.server as T).src} : x.v.client),
          },
          false,
        ).then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        });
        return x.v.p;
      });

    Promise.all(tableProm)
      .then(_ => reloadTable())
      .catch(_ => {
        alert("Some rows failed to save changes");
      });
  }

  export function make(e: CustomEvent<T>) {
    const x = e.detail as unknown as T;
    $tableData[x.src] = {client: x, server: $tableData[x.src]?.server, p: Promise.resolve()};
    tableKeys.push(x.src);
    tableKeys = tableKeys;
  }
</script>

<div class="wrapper">
  <div style="padding:8px;background-color:#bb7900;">
    Warning: This is currently still under development, however it DOES send updates to the real server
  </div>

  <div id="search-wrapper">
    <label>
      Search: <input type="search" name="table-search" bind:value={tableSearch} />
    </label>
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
            <slot name="headers" />
          </tr>
          <slot name="creator" {make} />
        </thead>
        <tbody>
          {#each tableKeys as src (src)}
            {#await $tableData[src].p}
              <tr><td colspan="5">Loading...</td></tr>
            {:then _}
              <slot name="row" value={writable($tableData[src])} />
            {:catch err}
              <tr><td colspan="5">Error loading row for {src}: {err}</td></tr>
            {/await}
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

  <div class="footer">
    <button class="btn-green" on:click={() => saveChanges()}>Save Changes</button>
    {#if rowStats.created > 0}
      <div class="meta-info">{rowStats.created} new row{rowStats.created > 1 ? "s" : ""}</div>
    {/if}
    {#if rowStats.modified > 0}
      <div class="meta-info">{rowStats.modified} unsaved change{rowStats.modified > 1 ? "s" : ""}</div>
    {/if}
    {#if rowStats.removed > 0}
      <div class="meta-info">{rowStats.removed} removed row{rowStats.removed > 1 ? "s" : ""}</div>
    {/if}
  </div>
</div>

<style>
  #search-wrapper {
    padding: 16px;
  }
</style>
