<script lang="ts">
  import RedirectCreator from "../components/RedirectCreator.svelte";
  import RedirectRow from "../components/RedirectRow.svelte";
  import {getBearer} from "../stores/login";
  import type {CSPair} from "../types/cspair";
  import {type Redirect, redirectEqual} from "../types/target";
  import {domainOption} from "../stores/domain-option";

  const apiViolet = import.meta.env.VITE_API_VIOLET;

  let redirectData: {[key: string]: CSPair<Redirect>} = {};
  let redirectSrcs: string[] = [];

  $: redirectSrcs = Object.entries(redirectData)
    .filter(x => x[1].client != null || x[1].server != null)
    .map(x => x[0])
    .filter(x => domainFilter(x, $domainOption))
    .sort((a, b) => a.localeCompare(b));

  function domainFilter(src: string, domain: string) {
    if (domain == "*") return true;
    let n = src.indexOf("/");
    if (n == -1) n = src.length;
    let p = src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

  let promiseForRedirects: Promise<void>;

  reloadRedirects();

  function reloadRedirects() {
    promiseForRedirects = new Promise<void>((res, rej) => {
      fetch(apiViolet + "/redirect", {headers: {Authorization: getBearer()}})
        .then(x => {
          if (x.status != 200) throw new Error("Unexpected status code: " + x.status);
          return x.json();
        })
        .then(x => {
          let redirects = x as Redirect[];
          let y: {[key: string]: CSPair<Redirect>} = {};
          redirects.forEach(x => {
            y[x.src] = {client: JSON.parse(JSON.stringify(x)), server: x};
          });
          redirectData = y;
          res();
        })
        .catch(x => rej(x));
    });
  }

  interface Savable<T> {
    type: "del" | "ins";
    v: T;
    p?: Promise<void>;
  }

  function saveChanges() {
    let redirectPromises = redirectSrcs
      .map(x => redirectData[x])
      .filter(x => x.client != null || x.server != null)
      .filter(x => !redirectEqual(x.client, x.server))
      .map((x: CSPair<Redirect>): Savable<CSPair<Redirect>> => {
        if (x.client == null && x.server != null) return {type: "del", v: x};
        return {type: "ins", v: x};
      })
      .sort((a, _) => (a.type === "del" ? -1 : a.type === "ins" ? 1 : 0))
      .map(x => {
        x.p = fetch(apiViolet + "/redirect", {
          method: x.type == "del" ? "DELETE" : "POST",
          headers: {Authorization: getBearer()},
          body: JSON.stringify(x.type == "del" ? {src: (x.v.server as Redirect).src} : x.v.client),
        }).then(x => {
          if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        });
      });

    Promise.all(redirectPromises).then(_ => {
      reloadRedirects();
    });
  }
</script>

<div class="wrapper">
  <div style="padding:8px;background-color:#bb7900;">
    Warning: This is currently still under development, however it DOES update the real server redirects
  </div>

  <div class="scrolling-area">
    {#await promiseForRedirects}
      <div class="text-padding">
        <div>Loading...</div>
      </div>
    {:then}
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Flags</th>
            <th>Code</th>
            <th>Description</th>
            <th>Active</th>
            <th>Option</th>
          </tr>
          <RedirectCreator
            on:make={e => {
              const x = e.detail;
              redirectData[x.src] = {client: x, server: redirectData[x.src]?.server};
              redirectSrcs.push(x.src);
              redirectSrcs = redirectSrcs;
            }}
          />
        </thead>
        <tbody>
          {#each redirectSrcs as src (src)}
            {#if redirectData[src]}
              <RedirectRow bind:value={redirectData[src]} />
            {:else}
              <tr><td colspan="5">Error loading row for {src}</td></tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {:catch err}
      <div class="text-padding">
        <div>Administrator... I hardly know her?</div>
        <div>{err}</div>
      </div>
    {/await}
  </div>

  <div class="footer">
    <button on:click={() => saveChanges()}>Save Changes</button>
  </div>
</div>

<style lang="scss">
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;

    thead {
      background-color: #333333;
      position: sticky;
      top: 0;
      z-index: 9999;
      box-shadow: 0 4px 8px #0003, 0 6px 20px #00000030;
    }

    :global(th),
    :global(td) {
      padding: 11px 8px 11px 8px;
      text-align: center;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .scrolling-area {
      overflow: auto;
      height: 100%;
    }
  }

  .text-padding {
    padding: 4px 16px;
  }

  .footer {
    height: 50px;
    background-color: #2c2c2c;
    box-shadow: 0 -4px 8px #0003, 0 -6px 20px #00000030;

    button {
      background-color: #04aa6d;
      border: none;
      box-shadow: none;
      box-sizing: border-box;
      color: black;
      cursor: pointer;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      height: 50px;
      padding: 4px 16px;
    }
  }
</style>
