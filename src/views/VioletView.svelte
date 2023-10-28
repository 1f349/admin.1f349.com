<script lang="ts">
  import RedirectCreator from "../components/RedirectCreator.svelte";
  import RouteCreator from "../components/RouteCreator.svelte";
  import RedirectRow from "../components/RedirectRow.svelte";
  import RouteRow from "../components/RouteRow.svelte";
  import {getBearer, loginStore, parseJwt, type LoginStore} from "../stores/login";
  import type {CSPair} from "../types/cspair";
  import {type Route, type Redirect, routeEqual, redirectEqual} from "../types/target";
  import {domainOption} from "../stores/domain-option";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let routeData: {[key: string]: CSPair<Route>} = {};
  let redirectData: {[key: string]: CSPair<Redirect>} = {};

  let routeSrcs: string[] = [];
  let redirectSrcs: string[] = [];

  $: routeSrcs = Object.entries(routeData)
    .filter(x => x[1].client != null || x[1].server != null)
    .map(x => x[0])
    .filter(x => domainFilter(x, $domainOption))
    .sort((a, b) => a.localeCompare(b));
  $: redirectSrcs = Object.entries(redirectData)
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

  let promiseForRoutes: Promise<void>;
  let promiseForRedirects: Promise<void>;

  reloadRoutes();
  reloadRedirects();

  function reloadRoutes() {
    promiseForRoutes = new Promise<void>((res, rej) => {
      fetch(apiViolet + "/route", {headers: {Authorization: getBearer()}})
        .then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
          return x.json();
        })
        .then(x => {
          let routes = x as Route[];
          routes.forEach(x => {
            routeData[x.src] = {client: JSON.parse(JSON.stringify(x)), server: x};
          });
          res();
        })
        .catch(x => rej(x));
    });
  }

  function reloadRedirects() {
    promiseForRedirects = new Promise<void>((res, rej) => {
      fetch(apiViolet + "/redirect", {headers: {Authorization: getBearer()}})
        .then(x => {
          if (x.status != 200) throw new Error("Unexpected status code: " + x.status);
          return x.json();
        })
        .then(x => {
          let redirects = x as Redirect[];
          redirects.forEach(x => {
            redirectData[x.src] = {client: JSON.parse(JSON.stringify(x)), server: x};
          });
          res();
        })
        .catch(x => rej(x));
    });
  }

  interface Savable<T> {
    type: "del" | "ins";
    v: T;
    p?: Promise<void>;
  }

  function saveChanges() {
    let routePromises = routeSrcs
      .map(x => routeData[x])
      .filter(x => x.client != null || x.server != null)
      .filter(x => !routeEqual(x.client, x.server))
      .map((x: CSPair<Route>): Savable<CSPair<Route>> => {
        if (x.client == null && x.server != null) return {type: "del", v: x};
        return {type: "ins", v: x};
      })
      .sort((a, _) => (a.type === "del" ? -1 : a.type === "ins" ? 1 : 0))
      .map(x => {
        x.p = fetch(apiViolet + "/route", {
          method: x.type == "del" ? "DELETE" : "POST",
          headers: {Authorization: getBearer()},
          body: JSON.stringify(x.type == "del" ? {src: (x.v.server as Route).src} : x.v.client),
        }).then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        });
      });

    let redirectPromises = redirectSrcs
      .map(x => redirectData[x])
      .filter(x => x.client != null || x.server != null)
      .filter(x => !redirectEqual(x.client, x.server))
      .map((x: CSPair<Redirect>): Savable<CSPair<Redirect>> => {
        if (x.client == null && x.server != null) return {type: "del", v: x};
        return {type: "ins", v: x};
      })
      .sort((a, _) => (a.type === "del" ? -1 : a.type === "ins" ? 1 : 0))
      .map(x => {
        x.p = fetch(apiViolet + "/route", {
          method: x.type == "del" ? "DELETE" : "POST",
          headers: {Authorization: getBearer()},
          body: JSON.stringify(x.type == "del" ? {src: (x.v.server as Redirect).src} : x.v.client),
        }).then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        });
      });

    Promise.all(routePromises).then(_ => {
      reloadRoutes();
    });
    Promise.all(redirectPromises).then(_ => {
      reloadRedirects();
    });
  }
</script>

<div style="padding:8px;background-color:#bb7900;">
  Warning: This is currently still under development and does not update the routes and redirects on the server
</div>

<button on:click={() => saveChanges()}>Save Changes</button>

<h2>Routes</h2>
{#await promiseForRoutes}
  <div>Loading...</div>
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
    </thead>
    <tbody>
      {#each routeSrcs as src (src)}
        {#if routeData[src]}
          <RouteRow bind:route={routeData[src]} />
        {:else}
          <tr><td colspan="5">Error loading row for {src}</td></tr>
        {/if}
      {/each}

      <RouteCreator
        on:make={e => {
          const x = e.detail;
          routeData[x.src] = {client: x, server: routeData[x.src]?.server};
          routeSrcs.push(x.src);
          routeSrcs = routeSrcs;
        }}
      />
    </tbody>
  </table>
{:catch err}
  <div>{err}</div>
{/await}

<h2>Redirects</h2>
{#await promiseForRedirects}
  <div>Loading...</div>
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
    </thead>
    <tbody>
      {#each redirectSrcs as src (src)}
        {#if redirectData[src]}
          <RedirectRow bind:redirect={redirectData[src]} />
        {:else}
          <tr><td colspan="5">Error loading row for {src}</td></tr>
        {/if}
      {/each}

      <RedirectCreator
        on:make={e => {
          const x = e.detail;
          redirectData[x.src] = {client: x, server: redirectData[x.src]?.server};
          redirectSrcs.push(x.src);
          redirectSrcs = redirectSrcs;
        }}
      />
    </tbody>
  </table>
{:catch err}
  <div>{err}</div>
{/await}

<style lang="scss">
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;

    thead {
      background-color: #04aa6d;
    }

    :global(th),
    :global(td) {
      padding: 11px 8px 11px 8px;
      text-align: center;
    }
  }
</style>
