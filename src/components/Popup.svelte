<script lang="ts">
  export let layer: number = 2000;
  export let show: boolean = false;
</script>

<button id="popup-backdrop" class:show style="--popup-layer: {layer};" on:click />

<div id="popup" class:show style="--popup-layer:{layer};">
  <slot />
</div>

<style lang="scss">
  @import "../values.scss";

  #popup-backdrop {
    @include button-reset;

    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--popup-layer);
    width: 100%;
    height: 100%;
    cursor: default;
    background-color: rgba(0,0,0,0.55);
    display: none;

    &.show {
      display: block;
      animation: fade 0.2s ease-out;
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  #popup {
    z-index: calc(var(--popup-layer) + 1);
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    background-color: $theme-header;
    cursor: auto;
    min-width: 400px;
    display: none;

    @media (max-width: 400px) {
      min-width: 100vw;
    }

    &.show {
      display: block;
      animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  @keyframes zoom {
    from {
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      transform: translate(-50%, -50%) scale(1);
    }
  }
</style>
