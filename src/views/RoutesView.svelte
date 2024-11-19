<script lang="ts">
  import ActionPopup from "../components/ActionPopup.svelte";
  import RouteRow from "../components/RouteRow.svelte";
  import TargetManagementView from "./TargetManagementView.svelte";
  import {routeKeys, type Route} from "../types/target";
  import Flags from "../components/Flags.svelte";
  import {tempClear, tempGet, tempSave} from "../utils/temp-saving";
  import {onMount} from "svelte";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let targetManagement: TargetManagementView<Route>;
  let createItem: Route = defaultCreateItem();
  let createPopup: boolean = false;
  let createErrorMessage = "";

  function defaultCreateItem(): Route {
    return {
      src: "",
      dst: "",
      flags: 0,
      active: false,
    };
  }

  const createItemStore: string = "routes-view-create-item";

  function createRoute() {
    createErrorMessage = "";
    tempSave(createItemStore, createItem);
    targetManagement
      .createItem(createItem)
      .then(() => {
        createPopup = false;
        createItem = defaultCreateItem();
        tempClear(createItemStore);
      })
      .catch(x => {
        createErrorMessage = x;
      });
  }

  onMount(() => {
    let start = tempGet<Route>(createItemStore);
    if (start != null) {
      createPopup = true;
      createErrorMessage = "You have been logged in";
      createItem = start;
    }
  });
</script>

<div class="row">
  <h1>Routes</h1>
  <button class="create-button" on:click={() => (createPopup = true)}>Create Route</button>

  <ActionPopup name="Create Route" bind:show={createPopup} on:save={createRoute}>
    <div>Source</div>
    <div><input type="text" class="code-font" bind:value={createItem.src} size={Math.max(20, createItem.src.length + 2)} /></div>
    <div>Destination</div>
    <div><input type="text" class="code-font" bind:value={createItem.dst} size={Math.max(20, createItem.dst.length + 2)} /></div>
    <div>Flags</div>
    <div><Flags bind:value={createItem.flags} editable keys={routeKeys} /></div>
    <div>Active</div>
    <div><input type="checkbox" bind:checked={createItem.active} /></div>
    {#if createErrorMessage}
      <div>{createErrorMessage}</div>
    {/if}
  </ActionPopup>
</div>

<TargetManagementView apiUrl="{apiViolet}/route" bind:this={targetManagement}>
  <svelte:fragment slot="headers">
    <th>Source</th>
    <th>Destination</th>
    <th>Flags</th>
    <th>Active</th>
    <th>Option</th>
  </svelte:fragment>
  <RouteRow slot="row" let:value {value} />
</TargetManagementView>

<style lang="scss">
  @import "../values.scss";

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .create-button {
    @include button-green-box;
  }
</style>
