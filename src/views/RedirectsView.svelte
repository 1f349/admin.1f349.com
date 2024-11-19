<script lang="ts">
  import {onMount} from "svelte";
  import ActionPopup from "../components/ActionPopup.svelte";
  import Flags from "../components/Flags.svelte";
  import RedirectCode from "../components/RedirectCode.svelte";
  import RedirectRow from "../components/RedirectRow.svelte";
  import {redirectKeys, type Redirect} from "../types/target";
  import {tempClear, tempGet, tempSave} from "../utils/temp-saving";
  import TargetManagementView from "./TargetManagementView.svelte";
  import Redirect from "../icons/Redirect.svelte";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let targetManagement: TargetManagementView<Redirect>;
  let createItem: Redirect = defaultCreateItem();
  let createPopup: boolean = false;
  let createErrorMessage = "";

  function defaultCreateItem(): Redirect {
    return {
      src: "",
      dst: "",
      flags: 0,
      code: 0,
      active: false,
    };
  }

  const createItemStore: string = "redirects-view-create-item";

  function createRedirect() {
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
    let start = tempGet<Redirect>(createItemStore);
    if (start != null) {
      createPopup = true;
      createErrorMessage = "You have been logged in";
      createItem = start;
    }
  });
</script>

<div class="row">
  <h1>Redirects</h1>
  <button class="create-button" on:click={() => (createPopup = true)}>Create Redirect</button>

  <ActionPopup name="Edit Redirect" bind:show={createPopup} on:save={createRedirect}>
    <div>Source</div>
    <div><input type="text" class="code-font" bind:value={createItem.src} size={Math.max(20, createItem.src.length + 2)} /></div>
    <div>Destination</div>
    <div><input type="text" class="code-font" bind:value={createItem.dst} size={Math.max(20, createItem.dst.length + 2)} /></div>
    <div>Flags</div>
    <div><Flags bind:value={createItem.flags} editable keys={redirectKeys} /></div>
    <div>Redirect Code</div>
    <div><RedirectCode bind:code={createItem.code} editable /></div>
    <div>Active</div>
    <div><input type="checkbox" bind:checked={createItem.active} /></div>
  </ActionPopup>
</div>

<TargetManagementView apiUrl="{apiViolet}/redirect" bind:this={targetManagement}>
  <svelte:fragment slot="headers">
    <th>Source</th>
    <th>Destination</th>
    <th>Flags</th>
    <th>Code</th>
    <th>Active</th>
    <th>Option</th>
  </svelte:fragment>
  <RedirectRow slot="row" let:value {value} />
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
