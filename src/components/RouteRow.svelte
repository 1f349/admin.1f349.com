<script lang="ts">
  import type {Writable} from "svelte/store";
  import {type CSPair, noCPair, noSPair, yesCPair} from "../types/cspair";
  import {type Route, routeKeys, routeEqual} from "../types/target";
  import Flags from "./Flags.svelte";

  export let value: Writable<CSPair<Route>>;

  let item: CSPair<Route>;
  $: item = $value;

  function resetRoute(): any {
    item.client = JSON.parse(JSON.stringify(item.server));
  }

  const descCols = 50;
</script>

{#if noCPair(item)}
  <tr class="deleted">
    <td class="code-font"><a href="https://{item.server.src}" target="_blank">{item.server.src}</a></td>
    <td><input type="text" class="code-font" disabled bind:value={item.server.dst} size={Math.max(20, item.server.dst.length + 2)} /></td>
    <td><Flags value={item.server.flags} keys={routeKeys} /></td>
    <td class="desc"><textarea rows="3" cols={descCols} disabled value={item.server.desc} /></td>
    <td><input type="checkbox" disabled checked={false} /></td>
    <td><button on:click={() => resetRoute()}>Restore</button></td>
  </tr>
{:else if yesCPair(item)}
  <tr class:created={noSPair(item)} class:modified={!noSPair(item) && !routeEqual(item.client, item.server)}>
    <td class="code-font"><a href="https://{item.client.src}" target="_blank">{item.client.src}</a></td>
    <td><input type="text" class="code-font" bind:value={item.client.dst} size={Math.max(20, item.client.dst.length + 2)} /></td>
    <td><Flags bind:value={item.client.flags} editable keys={routeKeys} /></td>
    <td class="desc"><textarea rows="3" cols={descCols} bind:value={item.client.desc} /></td>
    <td><input type="checkbox" bind:checked={item.client.active} /></td>
    <td>
      {#if !noSPair(item)}
        <button on:click={() => resetRoute()}>Reset</button>
      {/if}
      <button on:click={() => (item.client = null)}>Delete</button>
    </td>
  </tr>
{:else}
  <div>Invalid redirect row: please report this error</div>
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
