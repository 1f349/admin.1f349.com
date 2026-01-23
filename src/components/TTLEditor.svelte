<script lang="ts">
  export let value: number | null;

  const fiveMinutes = 60 * 5; // 300 seconds
  const oneHour = 60 * 60;
  const twoHours = oneHour * 2;
  const oneDay = oneHour * 24;
  const twoDays = oneDay * 2;
  const oneWeek = oneDay * 7;

  const ttlOptions = [
    {value: "default", name: "Default"},
    {value: "custom", name: "Custom"},
    {value: fiveMinutes, name: "Five Minutes"},
    {value: oneHour, name: "One Hour"},
    {value: twoHours, name: "Two Hours"},
    {value: oneDay, name: "One Day"},
    {value: twoDays, name: "Two Days"},
    {value: oneWeek, name: "One Week"},
  ];

  let currentPreset: string | number;
  let newValue: number;

  // Update currentPresent to match the state of value
  $: {
    newValue = value ?? 0;

    currentPreset = "custom";
    if (value === null) {
      currentPreset = "default";
    } else {
      for (const option of ttlOptions) {
        if (value === option.value) {
          currentPreset = value;
          break;
        }
      }
    }
  }

  function updateOutput() {
    // Follow the preset
    if (currentPreset === "default") {
      value = null;
      newValue = 0;
    }
    if (typeof currentPreset === "number") {
      value = currentPreset;
      newValue = currentPreset;
    }
  }
</script>

<div>
  <select bind:value={currentPreset} on:change={() => updateOutput()}>
    {#each ttlOptions as option}
      <option value={option.value}>{option.name}</option>
    {/each}
  </select>
  <span class:hide-custom-input={currentPreset !== "custom"}>
    <input type="text" class="code-font" bind:value={newValue} on:change={() => updateOutput()} />
    seconds
  </span>
</div>

<style>
  .hide-custom-input {
    display: none;
  }
</style>
