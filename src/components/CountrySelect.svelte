<script lang="ts">
  import {getCountryDataList} from "countries-list";

  const countriesList = getCountryDataList().sort((a, b) => a.name.localeCompare(b.name));

  export let value: string = "";
</script>

<input bind:value list="countries-list" {...$$restProps} />

<datalist id="countries-list">
  {#each countriesList as country}
    <option value={country.iso2}>{country.name}</option>
  {/each}
</datalist>
