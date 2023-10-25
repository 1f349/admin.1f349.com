<script lang="ts">
  import {type CSPair, noCPair, noSPair} from "../types/cspair";
  import {type Route, redirectKeys, redirectEqual} from "../types/target";
  import Flags from "./Flags.svelte";

  export let redirect: CSPair<Route>;

  function resetRedirect(): any {
    redirect.client = JSON.parse(JSON.stringify(redirect.server));
  }
</script>

{#if noCPair(redirect)}
  <tr class="deleted">
    <td class="code-font">{redirect.server.src}</td>
    <td><input type="text" class="code-font" disabled bind:value={redirect.server.dst} size={redirect.server.dst.length + 2} /></td>
    <td><Flags value={redirect.server.flags} keys={redirectKeys} /></td>
    <td><input type="checkbox" disabled checked={false} /></td>
    <td><button on:click={() => resetRedirect()}>Restore</button></td>
  </tr>
{:else}
  <tr class:created={noSPair(redirect)} class:modified={noSPair(redirect) || !redirectEqual(redirect.client, redirect.server)}>
    <td class="code-font">{redirect.client.src}</td>
    <td><input type="text" class="code-font" bind:value={redirect.client.dst} size={redirect.client.dst.length + 2} /></td>
    <td><Flags bind:value={redirect.client.flags} editable keys={redirectKeys} /></td>
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
  tr.created {
    background-color: #1a5100;
  }

  tr.modified {
    background-color: #515100;
  }

  tr.deleted {
    background-color: #510000;
  }

  td input[type="text"] {
    font-family: "Fira Code";
    padding: 4px;
  }
</style>
