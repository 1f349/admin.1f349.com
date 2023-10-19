<script lang="ts">
  import {loginStore, type LoginStore} from "../stores/login";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let promiseForRoutes = new Promise(async (res, rej) => {
    fetch(apiViolet + "/route", {headers: {Authorization: "Bearer " + ($loginStore as LoginStore).tokens.access}})
      .then(x => {
        if(x.status!==200) throw new Error("Unexpected status code: " + x.status);
        return x.json();
      })
      .then(x => res(x))
      .catch(x => rej(x));
  });
</script>

{#await promiseForRoutes}
  <div>Loading...</div>
{:then allRoutes}
  <table>
    <tr>
      <th>Source</th>
      <th>Destination</th>
      <th>Flags</th>
      <th>Active</th>
    </tr>
    <tr>
      <td />
      <td />
      <td />
      <td />
    </tr>
  </table>
{:catch err}
  <div>{err}</div>
{/await}
