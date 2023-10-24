<script lang="ts">
  import Flags from "../components/Flags.svelte";
  import {getBearer, loginStore, type LoginStore} from "../stores/login";

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

  let serverRoutes: Route[];
  let serverRedirects: Redirect[];

  let clientRoutes: Route[];
  let clientRedirects: Redirect[];

  function getServerRoute(src: string) {
    return serverRoutes.find(v => v.src === src);
  }

  function getServerRedirect(src: string) {
    return serverRedirects.find(v => v.src === src);
  }

  function routeEqual(a: Route, b: Route): boolean {
    return a.src === b.src && a.dst === b.dst && a.flags === b.flags && a.active === b.active;
  }

  function redirectEqual(a: Route, b: Route): boolean {
    return a.src === b.src && a.dst === b.dst && a.flags === b.flags && a.active === b.active;
  }

  function resetRoute(i: number, route: Route) {
    clientRoutes[i] = JSON.parse(JSON.stringify(route));
    clientRoutes = clientRoutes;
  }

  function resetRedirect(i: number, redirect: Redirect) {
    clientRedirects[i] = JSON.parse(JSON.stringify(redirect));
    clientRedirects = clientRedirects;
  }

  let promiseForRoutes = new Promise<void>((res, rej) => {
    fetch(apiViolet + "/route", {headers: {Authorization: getBearer()}})
      .then(x => {
        if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        return x.json();
      })
      .then(x => {
        serverRoutes = x as Route[];
        clientRoutes = JSON.parse(JSON.stringify(serverRoutes));
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
        serverRedirects = x as Redirect[];
        clientRedirects = JSON.parse(JSON.stringify(serverRedirects));
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
    {#each clientRoutes as route, i (route.src)}
      {@const serverRoute = getServerRoute(route.src)}
      {@const isNew = serverRoute == undefined}
      <tr class:created={isNew} class:modified={isNew || !routeEqual(route, serverRoute)}>
        <td>{route.src}</td>
        <td>{route.dst}</td>
        <td><Flags bind:value={route.flags} editable keys={routeKeys} /></td>
        <td><input type="checkbox" bind:checked={route.active} /></td>
        <td>{route.active}</td>
        <td>
          {#if !isNew}
            <button on:click={() => resetRoute(i, serverRoute)}>Reset</button>
          {/if}
        </td>
      </tr>
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
  table > tr.created {
    background-color: #1a5100;
  }
  table > tr.modified {
    background-color: #515100;
  }
</style>
