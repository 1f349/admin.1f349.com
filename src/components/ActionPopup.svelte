<script lang="ts">
  import Popup from "./Popup.svelte";
  import XIcon from "../icons/X.svelte";
  import {createEventDispatcher} from "svelte";

  const dispatch = createEventDispatcher();

  export let name: string;
  export let show: boolean = false;

  function save() {
    dispatch("save");
  }

  function close() {
    show = false;
  }
</script>

<Popup bind:show on:click={() => close()}>
  <div class="popup-inner">
    <div class="title-row">
      <h2>{name}</h2>
      <button class="close-button" on:click={() => close()}>
        <XIcon />
      </button>
    </div>
    <slot />
    <div class="button-row">
      <button class="btn-close" on:click={() => close()}>Close</button>
      <button class="btn-save" on:click={() => save()}>Save</button>
    </div>
  </div>
</Popup>

<style lang="scss">
  @import "../values.scss";

  .popup-inner {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .title-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .close-button {
      @include button-red-highlight;
    }
  }

  .button-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 16px;

    .btn-close {
      @include button-green-invert-box;
    }

    .btn-save {
      @include button-green-box;
    }
  }
</style>
