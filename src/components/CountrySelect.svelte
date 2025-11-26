<script lang="ts">
  import TomSelect from "tom-select";
  import {getCountryDataList, getEmojiFlag} from "countries-list";
  import {onDestroy, onMount} from "svelte";

  import "tom-select/dist/css/tom-select.css";

  const countriesList = getCountryDataList().sort((a, b) => a.name.localeCompare(b.name));

  let countrySelectElement: HTMLSelectElement;
  let countryTomSelect: TomSelect;

  onMount(() => {
    countryTomSelect = new TomSelect(countrySelectElement, {});
  });

  onDestroy(() => {
    countryTomSelect.destroy();
  });
</script>

<select bind:this={countrySelectElement} {...$$restProps} autocomplete="false" style="display:none;">
  {#each countriesList as x}
    <option value={x.iso2}>{x.name}</option>
  {/each}
</select>
