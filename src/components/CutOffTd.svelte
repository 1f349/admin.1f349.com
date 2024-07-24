<script>
  import CutOff from "./CutOff.svelte";
</script>

<td {...$$restProps}>
  <CutOff><slot /></CutOff>
</td>

<style lang="scss">
  td {
    width: 100%;
  }
</style>
