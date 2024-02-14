<script lang="ts">
  import {onMount, type SvelteComponent} from "svelte";
  import GeneralView from "./views/GeneralView.svelte";
  import RoutesView from "./views/RoutesView.svelte";
  import RedirectsView from "./views/RedirectsView.svelte";
  import CertificatesView from "./views/CertificatesView.svelte";
  import SitesView from "./views/SitesView.svelte";
  import {loginStore, parseJwt, type LoginStore} from "./stores/login";
  import {domainOption} from "./stores/domain-option";
  import {LOGIN} from "./utils/login";

  let sidebarOptions: Array<{name: string; view: typeof SvelteComponent<{}>}> = [
    {name: "General", view: GeneralView},
    {name: "Routes", view: RoutesView},
    {name: "Redirects", view: RedirectsView},
    {name: "Certificates", view: CertificatesView},
    {name: "Sites", view: SitesView},
  ];
  let sidebarSelection: {name: string; view: typeof SvelteComponent<{}>} = sidebarOptions[0];

  let tokenPerms: string[] = [];
  $: tokenPerms = [];

  let domainOptions: string[];
  $: domainOptions = getDomainOptions($loginStore);

  function getDomainOptions(login: LoginStore | null) {
    let accessToken = login?.tokens?.access;
    if (accessToken == null) return [];
    let jwt = parseJwt(accessToken);
    if (!jwt) return [];
    return jwt.per.filter((x: string) => x.startsWith("domain:owns=")).map((x: string) => x.slice("domain:owns=".length));
  }

  onMount(() => {
    LOGIN.init();
    LOGIN.userinfo(false);
  });
</script>

<header>
  <div>
    <h1>🍉 Admin Panel</h1>
  </div>
  <div class="flex-gap" />
  <div class="nav-link">
    <a href="https://status.1f349.com" target="_blank">Status</a>
  </div>
  {#if $loginStore == null}
    <div class="login-view">
      <button on:click={() => LOGIN.userinfo(true)}>Login</button>
    </div>
  {:else}
    <div class="user-view">
      <img class="user-avatar" src={$loginStore.userinfo.picture} alt="{$loginStore.userinfo.name}'s profile picture" />
      <div class="user-display-name">{$loginStore.userinfo.name}</div>
      <button
        on:click={() => {
          $loginStore = null;
          localStorage.removeItem("login-session");
          localStorage.removeItem("pop2_access_token");
        }}
      >
        Logout
      </button>
    </div>
  {/if}
</header>
<main>
  {#if $loginStore == null}
    <div id="login-view">Please login to continue</div>
  {:else}
    <div id="sidebar">
      {#each sidebarOptions as item (item.name)}
        <button class="sidebar-item" on:click={() => (sidebarSelection = item)} class:selected={item == sidebarSelection}>{item.name}</button>
      {/each}
    </div>
    <div id="option-view">
      <svelte:component this={sidebarSelection.view} />
    </div>
  {/if}
</main>
<footer>
  <div class="meta-version">
    Version: <code>{import.meta.env.VITE_APP_VERSION}</code>
    , {import.meta.env.VITE_APP_LASTMOD}
  </div>
  <div>
    <a href="https://github.com/1f349/admin.1f349.com" target="_blank">Source</a>
  </div>
  <div>
    <label>
      <span>Domain:</span>
      <select bind:value={$domainOption}>
        <option value="*">All</option>
        {#each domainOptions as domain}
          <option value={domain}>{domain}</option>
        {/each}
      </select>
    </label>
  </div>
</footer>

<style lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding: 0 32px;
    background-color: #2c2c2c;
    box-shadow:
      0 4px 8px #0003,
      0 6px 20px #00000030;
    gap: 16px;
    z-index: 1;
    position: relative;

    h1 {
      font-size: 32px;
      margin: 0;
    }

    .nav-link {
      font-size: 24px;
    }

    .flex-gap {
      flex-grow: 1;
    }

    .user-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
    }

    button,
    a {
      background-color: transparent;
      border: none;
      box-shadow: none;
      box-sizing: border-box;
      color: tomato;
      cursor: pointer;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      padding: 8px;
      border-radius: 0.375rem;
    }
  }

  main {
    display: flex;
    flex-grow: 1;
    align-items: stretch;
    height: 0;

    #sidebar {
      width: 150px;
      min-width: 150px;

      button {
        background-color: #2c2c2c;
        border: none;
        box-shadow: none;
        box-sizing: border-box;
        color: tomato;
        cursor: pointer;
        font-size: 20px;
        font-weight: 700;
        line-height: 24px;
        width: 100%;
        height: 70px;

        &:hover {
          background-color: #1c1c1c;
        }

        &.selected {
          background-color: #1c1c1c;
        }
      }
    }

    #login-view {
      padding: 16px;
    }

    #option-view {
      box-sizing: border-box;
      overflow-y: auto;
      height: 100%;
      flex-grow: 1;
    }
  }

  footer {
    padding: 8px;
    background-color: #2c2c2c;
    box-shadow:
      0 -4px 8px #0003,
      0 -6px 20px #00000030;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
