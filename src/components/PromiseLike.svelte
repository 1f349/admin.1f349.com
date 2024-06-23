<script lang="ts">
  import type {IPromiseLike} from "../utils/promise-like";

  type T = $$Generic<IPromiseLike>;

  export let value: T;

  function hasError(value: T) {
    return value.error() != null;
  }
</script>

{#if $value.isLoading()}
  <slot name="loading" />
{:else if hasError($value)}
  <slot name="error" reason={$value.error()} />
{:else}
  <slot name="ok" value={$value} />
{/if}
