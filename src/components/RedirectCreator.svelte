<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {redirectKeys, type Redirect} from "../types/target";
  import Flags from "./Flags.svelte";

  const dispatch = createEventDispatcher();
  let redirect: Redirect = {src: "", dst: "", flags: 0, active: true};
</script>

<tr class="created">
  <td><input type="text" class="code-font" bind:value={redirect.src} size={redirect.src.length + 2} /></td>
  <td><input type="text" class="code-font" bind:value={redirect.dst} size={redirect.dst.length + 2} /></td>
  <td><Flags value={redirect.flags} editable keys={redirectKeys} /></td>
  <td><input type="checkbox" bind:checked={redirect.active} /></td>
  <td>
    <button
      on:click={() => {
        dispatch("make", redirect);
        redirect = {src: "", dst: "", flags: 0, active: true};
      }}
    >
      Create
    </button>
  </td>
</tr>
