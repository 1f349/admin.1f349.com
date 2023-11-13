<script lang="ts">
  import RouteCreator from "../components/RouteCreator.svelte";
  import RouteRow from "../components/RouteRow.svelte";
  import {routeEqual} from "../types/target";
  import {routesTable} from "../stores/target";
  import TargetManagementView from "./TargetManagementView.svelte";

  const apiViolet = import.meta.env.VITE_API_VIOLET;
</script>

<TargetManagementView apiUrl="{apiViolet}/route" tableData={routesTable} equality={routeEqual}>
  <svelte:fragment slot="headers">
    <th>Source</th>
    <th>Destination</th>
    <th>Flags</th>
    <th>Description</th>
    <th>Active</th>
    <th>Option</th>
  </svelte:fragment>
  <RouteRow slot="row" let:value {value} />
  <RouteCreator slot="creator" let:make on:make={e => make(e)} />
</TargetManagementView>
