<script lang="ts">
  import PromiseLike from "./PromiseLike.svelte";
  import type {IPromiseLike} from "../utils/promise-like";

  type T = $$Generic<IPromiseLike>;

  export let value: T;
</script>

<PromiseLike {value}>
  <div class="text-padding" slot="loading">
    <div>Loading...</div>
  </div>

  <div class="text-padding" slot="error" let:reason>
    <div>Administrator... I hardly know her?</div>
    <div>{reason}</div>
  </div>

  <table class="action-table" slot="ok" let:value>
    <thead>
      <slot name="headers" {value} />
    </thead>
    <tbody>
      <slot name="rows" {value} />
    </tbody>
  </table>
</PromiseLike>

<style lang="scss">
  .text-padding,
  .text-padding div {
    padding: 8px;
  }
</style>
