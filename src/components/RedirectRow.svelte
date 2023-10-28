<script lang="ts">
  import {type CSPair, noCPair, noSPair} from "../types/cspair";
  import {type Route, redirectKeys, redirectEqual} from "../types/target";
  import Flags from "./Flags.svelte";

  export let redirect: CSPair<Route>;

  function resetRedirect(): any {
    redirect.client = JSON.parse(JSON.stringify(redirect.server));
  }

  const descCols = 50;
</script>

{#if noCPair(redirect)}
  <tr class="deleted">
    <td class="code-font"><a href="https://{redirect.server.src}" target="_blank">{redirect.server.src}</a></td>
    <td><input type="text" class="code-font" disabled bind:value={redirect.server.dst} size={Math.max(20, redirect.server.dst.length + 2)} /></td>
    <td><Flags value={redirect.server.flags} keys={redirectKeys} /></td>
    <td class="desc"><textarea rows="3" cols={descCols} disabled value={redirect.server.desc} /></td>
    <td><input type="checkbox" disabled checked={false} /></td>
    <td><button on:click={() => resetRedirect()}>Restore</button></td>
  </tr>
{:else}
  <tr class:created={noSPair(redirect)} class:modified={!noSPair(redirect) && !redirectEqual(redirect.client, redirect.server)}>
    <td class="code-font"><a href="https://{redirect.client.src}" target="_blank">{redirect.client.src}</a></td>
    <td><input type="text" class="code-font" bind:value={redirect.client.dst} size={Math.max(20, redirect.client.dst.length + 2)} /></td>
    <td><Flags bind:value={redirect.client.flags} editable keys={redirectKeys} /></td>
    <td class="desc"><textarea rows="3" cols={descCols} bind:value={redirect.client.desc} /></td>
    <td><input type="checkbox" bind:checked={redirect.client.active} /></td>
    <td>
      {#if !noSPair(redirect)}
        <button on:click={() => resetRedirect()}>Reset</button>
      {/if}
      <button on:click={() => (redirect.client = null)}>Delete</button>
    </td>
  </tr>
{/if}

<style lang="scss">
  tr:nth-child(2n) {
    background-color: #2a2a2a;
  }

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
</style>
