<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {redirectKeys, type Redirect} from "../types/target";
  import Flags from "./Flags.svelte";
  import RedirectCode from "./RedirectCode.svelte";

  const dispatch = createEventDispatcher();
  let redirect: Redirect = {src: "", dst: "", desc: "", flags: 0, code: 302, active: true};

  const descCols = 50;
</script>

<tr class="created">
  <td><input type="text" class="code-font" bind:value={redirect.src} size={Math.max(20, redirect.src.length + 2)} /></td>
  <td><input type="text" class="code-font" bind:value={redirect.dst} size={Math.max(20, redirect.dst.length + 2)} /></td>
  <td><Flags bind:value={redirect.flags} editable keys={redirectKeys} /></td>
  <td><RedirectCode bind:code={redirect.code} editable /></td>
  <td class="desc"><textarea rows="3" cols={descCols} bind:value={redirect.desc} /></td>
  <td><input type="checkbox" bind:checked={redirect.active} /></td>
  <td>
    <button
      on:click={() => {
        dispatch("make", redirect);
        redirect = {src: "", dst: "", desc: "", flags: 0, code: 302, active: true};
      }}
    >
      Create
    </button>
  </td>
</tr>

<style lang="scss">
  tr:nth-child(2n) {
    background-color: #2a2a2a;
  }

  tr:nth-child(2n + 1) {
    background-color: #242424;
  }

  tr.created {
    position: sticky;
    top: 0;
  }

  .desc textarea {
    resize: none;
  }
</style>
