<script lang="ts">
  export let code: number;
  export let editable: boolean = false;
</script>

<select bind:value={code} disabled={!editable}>
  <option value={301}>301 - Moved Permenantly</option>
  <option value={302} selected>302 - Found</option>
  <option value={307}>307 - Temporary Redirect</option>
  <option value={308}>308 - Permenant Redirect</option>
</select>
