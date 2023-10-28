<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {routeKeys, type Route} from "../types/target";
  import Flags from "./Flags.svelte";

  const dispatch = createEventDispatcher();
  let route: Route = {src: "", dst: "", desc: "", flags: 0, active: true};

  const descCols = 50;
</script>

<tr class="created">
  <td><input type="text" class="code-font" bind:value={route.src} size={Math.max(20, route.src.length + 2)} /></td>
  <td><input type="text" class="code-font" bind:value={route.dst} size={Math.max(20, route.dst.length + 2)} /></td>
  <td><Flags bind:value={route.flags} editable keys={routeKeys} /></td>
  <td class="desc"><textarea rows="3" cols={descCols} bind:value={route.desc} /></td>
  <td><input type="checkbox" bind:checked={route.active} /></td>
  <td>
    <button
      on:click={() => {
        dispatch("make", route);
        route = {src: "", dst: "", desc: "", flags: 0, active: true};
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

  .desc textarea {
    resize: none;
  }
</style>
