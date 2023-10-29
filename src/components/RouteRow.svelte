<script lang="ts">
  import {type CSPair, noCPair, noSPair} from "../types/cspair";
  import {type Route, routeKeys, routeEqual} from "../types/target";
  import Flags from "./Flags.svelte";

  export let route: CSPair<Route>;

  function resetRoute(): any {
    route.client = JSON.parse(JSON.stringify(route.server));
  }

  const descCols = 50;
</script>

{#if noCPair(route)}
  <tr class="deleted">
    <td class="code-font"><a href="https://{route.server.src}" target="_blank">{route.server.src}</a></td>
    <td><input type="text" class="code-font" disabled bind:value={route.server.dst} size={Math.max(20, route.server.dst.length + 2)} /></td>
    <td><Flags value={route.server.flags} keys={routeKeys} /></td>
    <td class="desc"><textarea rows="3" cols={descCols} disabled value={route.server.desc} /></td>
    <td><input type="checkbox" disabled checked={false} /></td>
    <td><button on:click={() => resetRoute()}>Restore</button></td>
  </tr>
{:else}
  <tr class:created={noSPair(route)} class:modified={!noSPair(route) && !routeEqual(route.client, route.server)}>
    <td class="code-font"><a href="https://{route.client.src}" target="_blank">{route.client.src}</a></td>
    <td><input type="text" class="code-font" bind:value={route.client.dst} size={Math.max(20, route.client.dst.length + 2)} /></td>
    <td><Flags bind:value={route.client.flags} editable keys={routeKeys} /></td>
    <td class="desc"><textarea rows="3" cols={descCols} bind:value={route.client.desc} /></td>
    <td><input type="checkbox" bind:checked={route.client.active} /></td>
    <td>
      {#if !noSPair(route)}
        <button on:click={() => resetRoute()}>Reset</button>
      {/if}
      <button on:click={() => (route.client = null)}>Delete</button>
    </td>
  </tr>
{/if}

<style lang="scss">
  tr.created {
    background-color: #1a5100;

    &:nth-child(2n) {
      background-color: #103300;
    }
  }

  tr.modified {
    background-color: #515100;

    &:nth-child(2n) {
      background-color: #333300;
    }
  }

  tr.deleted {
    background-color: #510000;

    &:nth-child(2n) {
      background-color: #330000;
    }
  }

  td input[type="text"] {
    padding: 4px;
  }

  .desc textarea {
    resize: none;
  }
</style>
