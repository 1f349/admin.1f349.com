<script lang="ts">
  import RedirectRow from "../components/RedirectRow.svelte";
  import TargetManagementView from "./TargetManagementView.svelte";

  const apiViolet = import.meta.env.VITE_API_VIOLET;
</script>

<h1>Redirects</h1>

<TargetManagementView apiUrl="{apiViolet}/redirect">
  <svelte:fragment slot="headers">
    <th>Source</th>
    <th>Destination</th>
    <th>Flags</th>
    <th>Code</th>
    <th>Active</th>
    <th>Option</th>
  </svelte:fragment>
  <RedirectRow slot="row" let:value {value} />
</TargetManagementView>
