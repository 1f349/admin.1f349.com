<script lang="ts">
  import RouteCreator from "../components/RouteCreator.svelte";
  import RouteRow from "../components/RouteRow.svelte";
  import {getBearer} from "../stores/login";
  import type {CSPair} from "../types/cspair";
  import {type Route, routeEqual} from "../types/target";
  import {domainOption} from "../stores/domain-option";
  import {routesTable} from "../stores/target";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let tableKeys: string[] = [];

  $: tableKeys = Object.entries($routesTable)
    .filter(x => x[1].client != null || x[1].server != null)
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

  function reloadTable(): Promise<void> {
    return new Promise<void>((res, rej) => {
      fetch(apiViolet + "/route", {headers: {Authorization: getBearer()}})
        .then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
          return x.json();
        })
        .then(x => {
          let rows = x as Route[];
          let srcs = new Set(Object.keys($routesTable));
          rows.forEach(x => {
            $routesTable[x.src] = {
              client: !$routesTable[x.src] ? JSON.parse(JSON.stringify(x)) : $routesTable[x.src]?.client,
              server: x,
              p: Promise.resolve(),
            };
            srcs.delete(x.src);
          });
          srcs.forEach(x => {
            $routesTable[x].server = null;
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
      .map(x => $routesTable[x])
      .filter(x => x.client != null || x.server != null)
      .filter(x => !routeEqual(x.client, x.server))
      .map((x: CSPair<Route>): Savable<Route> => {
        if (x.client == null && x.server != null) return {type: "del", v: x};
        return {type: "ins", v: x};
      })
      .sort((a, _) => (a.type === "del" ? -1 : a.type === "ins" ? 1 : 0))
      .map(x => {
        x.v.p = fetch(apiViolet + "/route", {
          method: x.type == "del" ? "DELETE" : "POST",
          headers: {Authorization: getBearer()},
          body: JSON.stringify(x.type == "del" ? {src: (x.v.server as Route).src} : x.v.client),
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
    Warning: This is currently still under development, however it DOES update the real server routes
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
            <th>Description</th>
            <th>Active</th>
            <th>Option</th>
          </tr>
          <RouteCreator
            on:make={e => {
              const x = e.detail;
              $routesTable[x.src] = {client: x, server: $routesTable[x.src]?.server, p: Promise.resolve()};
              tableKeys.push(x.src);
              tableKeys = tableKeys;
            }}
          />
        </thead>
        <tbody>
          {#each tableKeys as src (src)}
            {#await $routesTable[src].p}
              <tr><td colspan="5">Loading...</td></tr>
            {:then _}
              <RouteRow bind:value={$routesTable[src]} />
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
    <button on:click={() => saveChanges()}>Save Changes</button>
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

    button {
      background-color: #04aa6d;
      border: none;
      box-shadow: none;
      box-sizing: border-box;
      color: black;
      cursor: pointer;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      height: 50px;
      padding: 4px 16px;
    }
  }
</style>
