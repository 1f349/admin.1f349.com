<script lang="ts">
  import RedirectCreator from "../components/RedirectCreator.svelte";
  import RedirectRow from "../components/RedirectRow.svelte";
  import {redirectEqual} from "../types/target";
  import {redirectsTable} from "../stores/target";
  import TargetManagementView from "./TargetManagementView.svelte";

  const apiViolet = import.meta.env.VITE_API_VIOLET;
</script>

<TargetManagementView apiUrl="{apiViolet}/redirect" tableData={redirectsTable} equality={redirectEqual}>
  <svelte:fragment slot="headers">
    <th>Source</th>
    <th>Destination</th>
    <th>Flags</th>
    <th>Code</th>
    <th>Description</th>
    <th>Active</th>
    <th>Option</th>
  </svelte:fragment>
  <RedirectRow slot="row" let:value {value} />
  <RedirectCreator slot="creator" let:make on:make={e => make(e)} />
</TargetManagementView>
