<script lang="ts">
  import RouteRow from "../components/RouteRow.svelte";
  import TargetManagementView from "./TargetManagementView.svelte";

  const apiViolet = import.meta.env.VITE_API_VIOLET;
</script>

<h1>Routes</h1>

<TargetManagementView apiUrl="{apiViolet}/route">
  <svelte:fragment slot="headers">
    <th>Source</th>
    <th>Destination</th>
    <th>Flags</th>
    <th>Active</th>
    <th>Option</th>
  </svelte:fragment>
  <RouteRow slot="row" let:value {value} />
</TargetManagementView>
