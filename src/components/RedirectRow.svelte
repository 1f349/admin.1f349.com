<script lang="ts">
  import {type CSPair, noCPair, noSPair} from "../types/cspair";
  import {redirectKeys, redirectEqual, type Redirect} from "../types/target";
  import Flags from "./Flags.svelte";
  import RedirectCode from "./RedirectCode.svelte";

  export let value: CSPair<Redirect>;

  function resetRedirect(): any {
    value.client = JSON.parse(JSON.stringify(value.server));
  }

  const descCols = 50;
</script>

{#if noCPair(value)}
  <tr class="deleted">
    <td class="code-font"><a href="https://{value.server.src}" target="_blank">{value.server.src}</a></td>
    <td><input type="text" class="code-font" disabled bind:value={value.server.dst} size={Math.max(20, value.server.dst.length + 2)} /></td>
    <td><Flags value={value.server.flags} keys={redirectKeys} /></td>
    <td><RedirectCode bind:code={value.server.code} /></td>
    <td class="desc"><textarea rows="3" cols={descCols} disabled value={value.server.desc} /></td>
    <td><input type="checkbox" disabled checked={false} /></td>
    <td><button on:click={() => resetRedirect()}>Restore</button></td>
  </tr>
{:else}
  <tr class:created={noSPair(value)} class:modified={!noSPair(value) && !redirectEqual(value.client, value.server)}>
    <td class="code-font"><a href="https://{value.client.src}" target="_blank">{value.client.src}</a></td>
    <td><input type="text" class="code-font" bind:value={value.client.dst} size={Math.max(20, value.client.dst.length + 2)} /></td>
    <td><Flags bind:value={value.client.flags} editable keys={redirectKeys} /></td>
    <td><RedirectCode bind:code={value.client.code} editable /></td>
    <td class="desc"><textarea rows="3" cols={descCols} bind:value={value.client.desc} /></td>
    <td><input type="checkbox" bind:checked={value.client.active} /></td>
    <td>
      {#if !noSPair(value)}
        <button on:click={() => resetRedirect()}>Reset</button>
      {/if}
      <button on:click={() => (value.client = null)}>Delete</button>
    </td>
  </tr>
{/if}

<style lang="scss">
  tr:nth-child(2n) {
    background-color: #2a2a2a;
  }

  tr:nth-child(2n + 1) {
    background-color: #242424;
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

  .desc textarea {
    resize: none;
  }
</style>
