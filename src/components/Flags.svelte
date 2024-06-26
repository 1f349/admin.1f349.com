<script lang="ts">
  import {clickOutside} from "../directive/click_outside";

  export let value: number = 0;
  export let editable: boolean = false;
  export let keys: Key[];
  let isEditing: boolean;

  interface Key {
    char: string;
    name: string;
  }

  let flagStr: string = "";
  $: value, (flagStr = formatShortFlags());

  function formatShortFlags() {
    let s = "";
    for (let i = 0; i < keys.length; i++) {
      s += isFlagged(value, i) ? keys[i].char : "-";
    }
    return s;
  }

  function isFlagged(_: number, i: number): boolean {
    return (value & (1 << i)) != 0;
  }

  function setFlag(i: number, v: boolean) {
    if (v) {
      value = value | (1 << i);
    } else {
      value = value & ~(1 << i);
    }
  }
</script>

<div class="dropdown-check-list" class:dropdown-open={isEditing} use:clickOutside on:click_outside={() => (isEditing = false)}>
  <button on:click={() => (isEditing = !isEditing)}>
    <span class="text"><code>{flagStr}</code></span>
    <span class="arrow" />
  </button>
  <div class="items">
    {#each keys as key, i (i)}
      <div>
        <label>
          <input
            type="checkbox"
            on:click|stopPropagation={() => {}}
            on:change|stopPropagation={t => setFlag(i, t.currentTarget.checked)}
            checked={isFlagged(value, i)}
            disabled={!editable}
          />
          {key.name}
        </label>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .dropdown-check-list {
    position: relative;
    display: inline-block;

    > button {
      margin: 0;
      border-color: #aaa;
      white-space: nowrap !important;
      word-wrap: normal !important;
      cursor: default;
      box-sizing: border-box;
      user-select: none;
      border-width: 1px;
      border-style: inset;
      display: inline-block;
      position: relative;
      page-break-inside: avoid;
      overflow-clip-box: padding-box !important;
      padding: 1px 4px;
      vertical-align: baseline;
      border-radius: 4px;

      > .text {
        margin-right: 18px;
      }

      > .arrow {
        display: block;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0px;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1kb3duIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4=);
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }

    &.dropdown-open > button > .arrow {
      transform: translateY(-50%) rotateX(180deg);
    }

    > .items {
      display: none;
      position: absolute;
      top: calc(100% - 1px);
      left: 50%;
      transform: translateX(-50%);
      border-radius: 8px;
      background: #2b2a33;
      z-index: 999;
      padding: 4px 6px;
      border: 1px solid #000;
      text-align: left;
      white-space: nowrap !important;
      word-wrap: normal !important;
      page-break-inside: avoid;

      > div {
        margin-right: 6px;

        > label {
          display: block;
        }
      }
    }

    &.dropdown-open > .items {
      display: block;
    }
  }
</style>
