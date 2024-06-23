<script lang="ts">
  export let layer: number = 1000;
</script>

<button id="popover" style="--popover-layer: {layer};" on:click />

<div id="popover-content" style="--popover-layer: {layer};">
  <slot />
</div>

<style lang="scss">
  @import "../values.scss";

  #popover {
    @include button-reset;

    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--popover-layer);
    width: 100%;
    height: 100%;
    cursor: default;
  }

  #popover-content {
    z-index: calc(var(--popover-layer) + 1);
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 100%;
    background-color: $theme-header;
    cursor: auto;
  }
</style>
