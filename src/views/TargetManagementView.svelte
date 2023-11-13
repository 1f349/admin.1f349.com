<script lang="ts">
<<<<<<< TargetManagement.svelte
  import RedirectCreator from "../components/RedirectCreator.svelte";
  import RedirectRow from "../components/RedirectRow.svelte";
  import {getBearer} from "../stores/login";
  import type {CSPair} from "../types/cspair";
  import {type Redirect, redirectEqual} from "../types/target";
  import {domainOption} from "../stores/domain-option";
  import {redirectsTable, type CountStats, tableCountStats} from "../stores/target";
=======
  import RouteCreator from "../components/RouteCreator.svelte";
  import RouteRow from "../components/RouteRow.svelte";
  import {getBearer} from "../stores/login";
  import type {CSPair} from "../types/cspair";
  import {type Route, routeEqual} from "../types/target";
  import {domainOption} from "../stores/domain-option";
  import {routesTable, type CountStats, tableCountStats} from "../stores/target";
>>>>>>> ../views/RoutesView.svelte

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let tableKeys: string[] = [];

<<<<<<< TargetManagement.svelte
  $: tableKeys = Object.entries($redirectsTable)
=======
  $: tableKeys = Object.entries($routesTable)
>>>>>>> ../views/RoutesView.svelte
    .filter(x => x[1].client != null || x[1].server != null)
    .map(x => x[0])
    .filter(x => domainFilter(x, $domainOption))
    .sort((a, b) => a.localeCompare(b));

  let rowStats: CountStats = {created: 0, modified: 0, removed: 0};

<<<<<<< TargetManagement.svelte
  $: rowStats = tableCountStats($redirectsTable, tableKeys, redirectEqual);
=======
  $: rowStats = tableCountStats($routesTable, tableKeys, routeEqual);
>>>>>>> ../views/RoutesView.svelte

  function domainFilter(src: string, domain: string) {
    if (domain == "*") return true;
    let n = src.indexOf("/");
    if (n == -1) n = src.length;
    let p = src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

<<<<<<< TargetManagement.svelte
  let promiseForTable: Promise<void> = Object.keys($redirectsTable).length === 0 ? reloadTable() : Promise.resolve();

  function reloadTable(): Promise<void> {
    return new Promise<void>((res, rej) => {
      fetch(apiViolet + "/redirect", {headers: {Authorization: getBearer()}})
=======
  let promiseForTable: Promise<void> = Object.keys($routesTable).length === 0 ? reloadTable() : Promise.resolve();

  function reloadTable(): Promise<void> {
    return new Promise<void>((res, rej) => {
      fetch(apiViolet + "/route", {headers: {Authorization: getBearer()}})
>>>>>>> ../views/RoutesView.svelte
        .then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
          return x.json();
        })
        .then(x => {
<<<<<<< TargetManagement.svelte
          let rows = x as Redirect[];
          let srcs = new Set(Object.keys($redirectsTable));
          rows.forEach(x => {
            $redirectsTable[x.src] = {
              client: !$redirectsTable[x.src] ? JSON.parse(JSON.stringify(x)) : $redirectsTable[x.src]?.client,
=======
          let rows = x as Route[];
          let srcs = new Set(Object.keys($routesTable));
          rows.forEach(x => {
            $routesTable[x.src] = {
              client: !$routesTable[x.src] ? JSON.parse(JSON.stringify(x)) : $routesTable[x.src]?.client,
>>>>>>> ../views/RoutesView.svelte
              server: x,
              p: Promise.resolve(),
            };
            srcs.delete(x.src);
          });
          srcs.forEach(x => {
<<<<<<< TargetManagement.svelte
            $redirectsTable[x].server = null;
=======
            $routesTable[x].server = null;
>>>>>>> ../views/RoutesView.svelte
          });
          res();
        })
        .catch(x => rej(x));
    });
  }

  interface Savable<T> {
    type: "del" | "ins";
    v: CSPair<T>;
  }

  function saveChanges() {
    let tableProm = tableKeys
<<<<<<< TargetManagement.svelte
      .map(x => $redirectsTable[x])
      .filter(x => x.client != null || x.server != null)
      .filter(x => !redirectEqual(x.client, x.server))
      .map((x: CSPair<Redirect>): Savable<Redirect> => {
=======
      .map(x => $routesTable[x])
      .filter(x => x.client != null || x.server != null)
      .filter(x => !routeEqual(x.client, x.server))
      .map((x: CSPair<Route>): Savable<Route> => {
>>>>>>> ../views/RoutesView.svelte
        if (x.client == null && x.server != null) return {type: "del", v: x};
        return {type: "ins", v: x};
      })
      .sort((a, _) => (a.type === "del" ? -1 : a.type === "ins" ? 1 : 0))
      .map(x => {
<<<<<<< TargetManagement.svelte
        x.v.p = fetch(apiViolet + "/redirect", {
          method: x.type == "del" ? "DELETE" : "POST",
          headers: {Authorization: getBearer()},
          body: JSON.stringify(x.type == "del" ? {src: (x.v.server as Redirect).src} : x.v.client),
=======
        x.v.p = fetch(apiViolet + "/route", {
          method: x.type == "del" ? "DELETE" : "POST",
          headers: {Authorization: getBearer()},
          body: JSON.stringify(x.type == "del" ? {src: (x.v.server as Route).src} : x.v.client),
>>>>>>> ../views/RoutesView.svelte
        }).then(x => {
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
</script>

<div class="wrapper">
  <div style="padding:8px;background-color:#bb7900;">
<<<<<<< TargetManagement.svelte
    Warning: This is currently still under development, however it DOES update the real server redirects
=======
    Warning: This is currently still under development, however it DOES update the real server routes
>>>>>>> ../views/RoutesView.svelte
  </div>

  <div class="scrolling-area">
    {#await promiseForTable}
      <div class="text-padding">
        <div>Loading...</div>
      </div>
    {:then}
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Flags</th>
<<<<<<< TargetManagement.svelte
            <th>Code</th>
=======
>>>>>>> ../views/RoutesView.svelte
            <th>Description</th>
            <th>Active</th>
            <th>Option</th>
          </tr>
<<<<<<< TargetManagement.svelte
          <RedirectCreator
            on:make={e => {
              const x = e.detail;
              $redirectsTable[x.src] = {client: x, server: $redirectsTable[x.src]?.server, p: Promise.resolve()};
=======
          <RouteCreator
            on:make={e => {
              const x = e.detail;
              $routesTable[x.src] = {client: x, server: $routesTable[x.src]?.server, p: Promise.resolve()};
>>>>>>> ../views/RoutesView.svelte
              tableKeys.push(x.src);
              tableKeys = tableKeys;
            }}
          />
        </thead>
        <tbody>
          {#each tableKeys as src (src)}
<<<<<<< TargetManagement.svelte
            {#await $redirectsTable[src].p}
              <tr><td colspan="5">Loading...</td></tr>
            {:then _}
              <RedirectRow bind:value={$redirectsTable[src]} />
=======
            {#await $routesTable[src].p}
              <tr><td colspan="5">Loading...</td></tr>
            {:then _}
              <RouteRow bind:value={$routesTable[src]} />
>>>>>>> ../views/RoutesView.svelte
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
<<<<<<< TargetManagement.svelte
      <div class="meta-info">{rowStats.created} new redirect{rowStats.created > 1 ? "s" : ""}</div>
=======
      <div class="meta-info">{rowStats.created} new route{rowStats.created > 1 ? "s" : ""}</div>
>>>>>>> ../views/RoutesView.svelte
    {/if}
    {#if rowStats.modified > 0}
      <div class="meta-info">{rowStats.modified} unsaved change{rowStats.modified > 1 ? "s" : ""}</div>
    {/if}
    {#if rowStats.removed > 0}
<<<<<<< TargetManagement.svelte
      <div class="meta-info">{rowStats.removed} removed redirect{rowStats.removed > 1 ? "s" : ""}</div>
=======
      <div class="meta-info">{rowStats.removed} removed route{rowStats.removed > 1 ? "s" : ""}</div>
>>>>>>> ../views/RoutesView.svelte
    {/if}
  </div>
</div>

<style lang="scss">
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;

    thead {
      background-color: #333333;
      position: sticky;
      top: 0;
      z-index: 9999;
      box-shadow: 0 4px 8px #0003, 0 6px 20px #00000030;
    }

    :global(th),
    :global(td) {
      padding: 11px 8px 11px 8px;
      text-align: center;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .scrolling-area {
      overflow: auto;
      height: 100%;
    }
  }

  .text-padding {
    padding: 4px 16px;
  }

  .footer {
    height: 50px;
    background-color: #2c2c2c;
    box-shadow: 0 -4px 8px #0003, 0 -6px 20px #00000030;
    display: flex;
    flex-direction: row;

    .meta-info {
      line-height: 50px;
      padding-inline: 16px;
    }
  }
</style>
