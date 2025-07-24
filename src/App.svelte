<script lang="ts">
  import {onMount, type SvelteComponent} from "svelte";
  import GeneralView from "./views/HomeView.svelte";
  import RoutesView from "./views/RoutesView.svelte";
  import RedirectsView from "./views/RedirectsView.svelte";
  import CertificatesView from "./views/CertificatesView.svelte";
  import SitesView from "./views/SitesView.svelte";
  import {loginStore} from "./stores/login";
  import {domainOption, domainOptions, setDomainOption} from "./stores/domain-option";
  import {LOGIN} from "./utils/login";
  import DomainIcon from "./icons/Domain.svelte";
  import HomeIcon from "./icons/Home.svelte";
  import CertificateIcon from "./icons/Certificate.svelte";
  import RouteIcon from "./icons/Route.svelte";
  import SiteIcon from "./icons/Site.svelte";
  import RedirectIcon from "./icons/Redirect.svelte";
  import MenuIcon from "./icons/Menu.svelte";
  import StatusIcon from "./icons/Status.svelte";
  import SourceIcon from "./icons/Source.svelte";
  import DomainsView from "./views/DomainsView.svelte";
  import ChevronDownIcon from "./icons/ChevronDown.svelte";
  import ChevronUpIcon from "./icons/ChevronUp.svelte";
  import Popover from "./components/Popover.svelte";
  import UserPopover from "./components/popover/UserPopover.svelte";

  type SidebarTab = {name: string; icon: typeof SvelteComponent<{}>; view: typeof SvelteComponent<{}>};

  let sidebarOptions: Array<SidebarTab> = [
    {name: "Home", icon: HomeIcon, view: GeneralView},
    {name: "Routes", icon: RouteIcon, view: RoutesView},
    {name: "Redirects", icon: RedirectIcon, view: RedirectsView},
    {name: "Certificates", icon: CertificateIcon, view: CertificatesView},
    {name: "Domains", icon: DomainIcon, view: DomainsView},
    {name: "Sites", icon: SiteIcon, view: SitesView},
  ];
  if (!import.meta.env.VITE_API_VERBENA) sidebarOptions = sidebarOptions.filter(x => x.name !== "Domains");

  let sidebarSelection: SidebarTab = findSidebarTab(localStorage.getItem("sidebar-tab") || "");

  function findSidebarTab(name: string): SidebarTab {
    return sidebarOptions.find(x => x.name === name) || sidebarOptions[0];
  }

  function setSidebarTab(name: string) {
    sidebarSelection = findSidebarTab(name);
    localStorage.setItem("sidebar-tab", name);
  }

  let tokenPerms: string[] = [];
  $: tokenPerms = [];

  let sidebarOpen: boolean = localStorage.getItem("sidebar-open") == "yes";

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    localStorage.setItem("sidebar-open", sidebarOpen ? "yes" : "no");
  }

  let userDropdownOpen: boolean = false;

  function toggleUserDropdown() {
    userDropdownOpen = !userDropdownOpen;
  }

  let hasPopover: boolean;
  $: hasPopover = userDropdownOpen;

  onMount(() => {
    LOGIN.userinfo();
  });
</script>

<nav id="sidebar" class:sidebar-open={sidebarOpen}>
  <button class="title" on:click={() => setSidebarTab("")}>
    <div class="icon">🍉</div>
    <div class="text">1f349</div>
  </button>
  {#each sidebarOptions as item (item.name)}
    <button on:click={() => setSidebarTab(item.name)} class:selected={item == sidebarSelection}>
      {#if item.icon != null}
        <div class="icon"><svelte:component this={item.icon} /></div>
      {/if}
      <div class="text">{item.name}</div>
    </button>
  {/each}
  <div class="flex-gap" />
  <a href="https://status.1f349.com" target="_blank" class="status">
    <div class="icon"><StatusIcon /></div>
    <div class="text">Status</div>
  </a>
  <a href="https://github.com/1f349/admin.1f349.com" target="_blank">
    <div class="icon"><SourceIcon /></div>
    <div class="text">{import.meta.env.VITE_APP_VERSION}</div>
  </a>
</nav>

<div id="root" class:hasPopover>
  <div id="sidebar-gap" class:sidebar-open={sidebarOpen} />
  <div id="content">
    <header>
      <button id="menu-toggle" on:click={() => toggleSidebar()}>
        <MenuIcon />
      </button>
      <div>
        <label>
          <span>Domain:</span>
          <select value={$domainOption} on:change={x => setDomainOption(x.currentTarget.value)}>
            {#each $domainOptions as domain}
              <option value={domain}>{domain}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="flex-gap" />
      <div class="nav-link"></div>
      {#if $loginStore != null}
        <div style="position:relative;">
          <button id="user-dropdown" on:click={() => toggleUserDropdown()}>
            <img class="user-avatar" src={$loginStore.userinfo.picture} alt="{$loginStore.userinfo.name}'s profile picture" />
            <div class="user-display-name">{$loginStore.userinfo.name}</div>
            <div>
              {#if userDropdownOpen}
                <ChevronUpIcon />
              {:else}
                <ChevronDownIcon />
              {/if}
            </div>
          </button>
          {#if userDropdownOpen}
            <Popover on:click={() => (userDropdownOpen = false)}>
              <UserPopover />
            </Popover>
          {/if}
        </div>
      {/if}
    </header>
    <div id="content-inner">
      <main>
        {#if $loginStore == null}
          <div id="login-view">Please login to continue</div>
        {:else}
          <svelte:component this={sidebarSelection.view} />
        {/if}
      </main>
    </div>
  </div>
</div>

<style lang="scss">
  @import "values.scss";

  #root {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
  }

  #sidebar-gap {
    width: 50px;
    transition: linear 100ms width;
    flex-shrink: 0;

    &.sidebar-open {
      width: $sidebar-width;
    }
  }

  #sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: $sidebar-width-short;
    transition: linear 100ms width;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: hidden;
    z-index: 999;
    background-color: $theme-sidebar;
    height: 100vh;

    button,
    a {
      @include button-reset;

      font-family: "Iosevka";
      font-weight: 400;

      font-size: 20px;
      font-weight: 400;
      padding: 8px 13px;
      text-wrap: nowrap;
      text-align: left;
      overflow: hidden;
      line-height: 0;

      display: flex;
      flex-direction: row;
      gap: 12px;

      .text {
        line-height: 24px;
        vertical-align: middle;
      }

      &:hover:not(.title) {
        background-color: $sidebar-highlight;
      }
    }

    button.selected {
      background-color: $sidebar-highlight;
    }

    button.title {
      height: $header-height;
      align-items: center;
      padding: 8px 10px;
      background-color: $theme-header;

      .icon {
        font-size: 140%;
      }
    }

    &.sidebar-open,
    &:hover {
      width: $sidebar-width;
    }
  }

  #menu-toggle {
    @include button-green-highlight;
    width: 50px;
  }

  #content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    main {
      flex-grow: 1;
    }
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $header-height;
    background-color: $theme-header;
    z-index: 1;
  }

  #user-dropdown {
    @include button-green-highlight($square: false);

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 9px;
    padding: 9px 12px;
    aspect-ratio: none;
    width: auto;
    height: 50px;

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
  }

  #content #content-inner {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: stretch;
    height: 0;
    margin-inline: 32px;

    main {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: stretch;
      font-size: 14px;

      #login-view {
        padding: 16px;
      }

      align-self: center;
      width: 100%;
      max-width: 1280px;
      padding: 24px 0px 32px;
      transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
</style>
