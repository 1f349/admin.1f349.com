<script lang="ts">
  import EditIcon from "../icons/Edit.svelte";
  import RemoveIcon from "../icons/Remove.svelte";

  type T = $$Generic<any>;

  export let data: T;
  export let edit: ((t: T) => void) | null;
  export let remove: ((t: T) => void) | null;
</script>

<div class="action-menu">
  {#if edit != null}
    <button class="edit" on:click={() => edit(data)}>
      <EditIcon />
    </button>
  {/if}
  {#if remove != null}
    <button class="remove" on:click={() => remove(data)}>
      <RemoveIcon />
    </button>
  {/if}
</div>

<style lang="scss">
  @import "../values.scss";

  .action-menu {
    height: 100%;
    display: flex;

    button {
      display: block;
      height: 100%;

      &.edit {
        @include button-green-highlight;
      }

      &.remove {
        @include button-red-highlight;
      }
    }
  }
</style>
