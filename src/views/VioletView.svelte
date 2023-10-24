<script lang="ts">
  import Flags from "../components/Flags.svelte";
  import {getBearer} from "../stores/login";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  const routeKeys = [
    {char: "p", name: "Prefix Path"},
    {char: "a", name: "Absolute Path"},
    {char: "c", name: "CORS"},
    {char: "s", name: "Secure Mode"},
    {char: "h", name: "Forward Host"},
    {char: "f", name: "Forward Address"},
    {char: "i", name: "Ignore Certificate"},
    {char: "w", name: "Websocket"},
  ];

  const redirectKeys = [
    {char: "p", name: "Prefix Path"},
    {char: "a", name: "Absolute Path"},
  ];

  interface Route {
    src: string;
    dst: string;
    flags: number;
    active: boolean;
  }

  interface Redirect {
    src: string;
    dst: string;
    flags: number;
    active: boolean;
  }

  type CSPair<T> = {client: T; server: T} | CSPairNotC<T> | CSPairNotS<T>;
  type CSPairNotC<T> = {client: null; server: T};
  type CSPairNotS<T> = {client: T; server: null};

  let routeData: Map<string, CSPair<Route>> = new Map();
  let redirectData: Map<string, CSPair<Redirect>> = new Map();

  let routeSrcs: Set<string> = new Set();
  let redirectSrcs: Set<string> = new Set();

  $: console.log(routeData);

  function routeEqual(a: Route, b: Route): boolean {
    return a.src === b.src && a.dst === b.dst && a.flags === b.flags && a.active === b.active;
  }

  function redirectEqual(a: Route, b: Route): boolean {
    return a.src === b.src && a.dst === b.dst && a.flags === b.flags && a.active === b.active;
  }

  function noCPair<T>(pair: CSPair<T>): pair is CSPairNotC<T> {
    return pair.client == null;
  }

  function noSPair<T>(pair: CSPair<T>): pair is CSPairNotS<T> {
    return pair.server == null;
  }

  let promiseForRoutes = new Promise<void>((res, rej) => {
    fetch(apiViolet + "/route", {headers: {Authorization: getBearer()}})
      .then(x => {
        if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        return x.json();
      })
      .then(x => {
        let routes = x as Route[];
        routes.forEach(x => {
          routeData.set(x.src, {client: JSON.parse(JSON.stringify(x)), server: x});
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
          redirectData.set(x.src, {client: JSON.parse(JSON.stringify(x)), server: x});
        });
        res();
      })
      .catch(x => rej(x));
  });
</script>

<h2>Routes</h2>
{#await promiseForRoutes}
  <div>Loading...</div>
{:then}
  <table>
    <tr>
      <th>Source</th>
      <th>Destination</th>
      <th>Flags</th>
      <th>Active</th>
    </tr>
    {#each routeSrcs as src (src)}
      {@const route = routeData.get(src)}
      {#if route}
        {#if noCPair(route)}
          <tr class="deleted">
            <td>{route.server.src}</td>
            <td>{route.server.dst}</td>
            <td><Flags bind:value={route.flags} editable keys={routeKeys} /></td>
            <td><input type="checkbox" bind:checked={route.active} /></td>
          </tr>
        {/if}
        {@const isCreated = !route.server}
        {@const isDeleted = !route.client}
        <tr class:created={isCreated} class:modified={isCreated || !routeEqual(route.client, route.server)} class:deleted={isDeleted}>
          <td>{route.client.src}</td>
          <td>{route.client.dst}</td>
          <td><Flags bind:value={route.flags} editable keys={routeKeys} /></td>
          <td><input type="checkbox" bind:checked={route.active} /></td>
          <td>
            {#if !isCreated}
              <button on:click={() => resetRoute(i, serverRoute)}>Reset</button>
            {/if}
          </td>
        </tr>
      {/if}
    {/each}
  </table>
{:catch err}
  <div>{err}</div>
{/await}

<h2>Redirects</h2>
{#await promiseForRedirects}
  <div>Loading...</div>
{:then}
  <table>
    <tr>
      <th>Source</th>
      <th>Destination</th>
      <th>Flags</th>
      <th>Active</th>
    </tr>
    {#each clientRedirects as redirect, i (redirect.src)}
      {@const serverRedirect = getServerRedirect(redirect.src)}
      {@const isNew = serverRedirect == undefined}
      <tr class:created={isNew} class:modified={isNew || !redirectEqual(redirect, serverRedirect)}>
        <td>{redirect.src}</td>
        <td>{redirect.dst}</td>
        <td><Flags bind:value={redirect.flags} editable keys={redirectKeys} /></td>
        <td><input type="checkbox" bind:checked={redirect.active} /></td>
        <td>
          {#if !isNew}
            <button on:click={() => resetRedirect(i, serverRedirect)}>Reset</button>
          {/if}
        </td>
      </tr>
    {/each}
  </table>
{:catch err}
  <div>{err}</div>
{/await}

<style lang="scss">
  table {
    > tr.created {
      background-color: #1a5100;
    }

    > tr.modified {
      background-color: #515100;
    }
  }
</style>
