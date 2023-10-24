<script lang="ts">
  import type {SvelteComponent} from "svelte";
  import GeneralView from "./views/GeneralView.svelte";
  import VioletView from "./views/VioletView.svelte";
  import OrchidView from "./views/OrchidView.svelte";
  import {loginStore} from "./stores/login";
  import {openLoginPopup} from "./utils/login-popup";

  let sidebarOptions: Array<{name: string; view: typeof SvelteComponent<{}>}> = [
    {name: "General", view: GeneralView},
    {name: "Violet", view: VioletView},
    {name: "Orchid", view: OrchidView},
  ];
  let sidebarSelection: {name: string; view: typeof SvelteComponent<{}>} = sidebarOptions[0];

  let tokenPerms: string[] = [];
  $: tokenPerms = [];
</script>

<header>
  <div>
    <h1>🍉 - 1f349 Admin Dashboard</h1>
  </div>
  <div class="flex-gap" />
  <div class="nav-link">
    <a href="https://status.1f349.net" target="_blank">Status</a>
  </div>
  {#if $loginStore == null}
    <div class="login-view">
      <button on:click={() => openLoginPopup()}>Login</button>
    </div>
  {:else}
    <div class="user-view">
      <img class="user-avatar" src={$loginStore.userinfo.picture} alt="{$loginStore.userinfo.name}'s profile picture" />
      <div class="user-display-name">{$loginStore.userinfo.name}</div>
      <button
        on:click={() => {
          $loginStore = null;
          localStorage.removeItem("login-session");
        }}>Logout</button
      >
    </div>
  {/if}
</header>
<main>
  {#if $loginStore == null}
    <div id="option-view">Please login to continue</div>
  {:else}
    <div id="sidebar">
      {#each sidebarOptions as item (item.name)}
        <button class="sidebar-item" on:click={() => (sidebarSelection = item)} class:selected={item == sidebarSelection}>{item.name}</button>
      {/each}
    </div>
    <div id="option-view">
      <h2>{sidebarSelection.name}</h2>
      <svelte:component this={sidebarSelection.view} />
    </div>
  {/if}
</main>

<style lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding: 0 32px;
    background-color: #2c2c2c;
    box-shadow: 0 4px 8px #0003, 0 6px 20px #00000030;
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
    height: calc(100% - 70px);

    #sidebar {
      width: 200px;

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

    #option-view {
      box-sizing: border-box;
      padding: 16px;
      overflow-y: auto;
      height: 100%;
      flex-grow: 1;

      h2 {
        margin: 0;
        margin-bottom: 16px;
      }
    }
  }
</style>
