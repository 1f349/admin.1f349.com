<script lang="ts">
  import {type Route, routeKeys} from "../types/target";
  import Flags from "./Flags.svelte";
  import type {RestItem} from "../utils/rest-table";
  import ActionMenu from "./ActionMenu.svelte";
  import ActionPopup from "./ActionPopup.svelte";
  
  export let value: RestItem<Route>;
  let editItem: Route = {
    src: "",
    dst: "",
    flags: 0,
    active: false,
  };

  let editPopup: boolean = false;

  function save() {
    value.update(editItem);
  }
</script>

<tr>
  <td class="code-font"><a href="https://{value.data.src}" target="_blank">{value.data.src}</a></td>
  <td>{value.data.dst}</td>
  <td><Flags bind:value={value.data.flags} keys={routeKeys} /></td>
  <td><input type="checkbox" disabled checked={value.data.active} /></td>
  <td>
    <ActionMenu
      data={value}
      edit={() => {
        editItem = JSON.parse(JSON.stringify(value.data));
        editPopup = true;
      }}
      remove={() => value.remove()}
    />

    <ActionPopup name="Edit Route" bind:show={editPopup} on:save={save}>
      <div>Source</div>
      <div class="code-font">{editItem.src}</div>
      <div>Destination</div>
      <div><input type="text" class="code-font" bind:value={editItem.dst} size={Math.max(20, editItem.dst.length + 2)} /></div>
      <div>Flags</div>
      <div><Flags bind:value={editItem.flags} editable keys={routeKeys} /></div>
      <div>Active</div>
      <div><input type="checkbox" bind:checked={editItem.active} /></div>
    </ActionPopup>
  </td>
</tr>

<style lang="scss">
  td input[type="text"] {
    padding: 4px;
  }
</style>
