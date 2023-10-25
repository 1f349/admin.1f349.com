<script lang="ts">
  import RedirectCreator from "../components/RedirectCreator.svelte";
  import RouteCreator from "../components/RouteCreator.svelte";
  import RedirectRow from "../components/RedirectRow.svelte";
  import RouteRow from "../components/RouteRow.svelte";
  import {getBearer} from "../stores/login";
  import type {CSPair} from "../types/cspair";
  import {type Route, type Redirect} from "../types/target";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let routeData: {[key: string]: CSPair<Route>} = {};
  let redirectData: {[key: string]: CSPair<Redirect>} = {};

  let routeSrcs: string[] = [];
  let redirectSrcs: string[] = [];

  $: routeSrcs = Object.entries(routeData)
    .filter(x => x[1].client != null || x[1].server != null)
    .map(x => x[0])
    .sort((a, b) => a.localeCompare(b));
  $: redirectSrcs = Object.entries(redirectData)
    .filter(x => x[1].client != null || x[1].server != null)
    .map(x => x[0])
    .sort((a, b) => a.localeCompare(b));

  $: console.log(routeData);

  let promiseForRoutes = new Promise<void>((res, rej) => {
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
  let promiseForRedirects = new Promise<void>((res, rej) => {
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
</script>

<div style="padding:8px;background-color:#bb7900;">
  Warning: This is currently still under development and does not update the routes and redirects on the server
</div>

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
    </tbody>
    <tfoot>
      <RouteCreator
        on:make={e => {
          const x = e.detail;
          routeData[x.src] = {client: x, server: null};
          routeSrcs.push(x.src);
          routeSrcs = routeSrcs;
        }}
      />
    </tfoot>
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
    </tbody>
    <tfoot>
      <RedirectCreator
        on:make={e => {
          const x = e.detail;
          redirectData[x.src] = {client: x, server: null};
          redirectSrcs.push(x.src);
          redirectSrcs = redirectSrcs;
        }}
      />
    </tfoot>
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
