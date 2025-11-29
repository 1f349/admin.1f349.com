<script lang="ts">
  import type {IPv4, IPv6} from "ipaddr.js";
  import ActionPopup from "../components/ActionPopup.svelte";
  import PromiseLike from "../components/PromiseLike.svelte";
  import PromiseTable from "../components/PromiseTable.svelte";
  import {domainOption} from "../stores/domain-option";
  import {RestItem, RestTable} from "../utils/rest-table";
  import DynamicListView from "../components/DynamicListView.svelte";
  import Address from "ipaddr.js";
  import {getEmojiFlag, type TCountryCode} from "countries-list";
  import CountrySelect from "../components/CountrySelect.svelte";
  import ActionMenu from "../components/ActionMenu.svelte";
  import RefreshCW from "../icons/RefreshCW.svelte";
  import RefreshCWOff from "../icons/RefreshCWOff.svelte";
  import RefreshCWWDot from "../icons/RefreshCWWDot.svelte";
  import Certificate from "../icons/Certificate.svelte";

  const apiOrchid = import.meta.env.VITE_API_ORCHID;

  const table = new RestTable<Cert>(apiOrchid + "/certs", (item: Cert) => item.id.toString());

  interface Cert {
    id: number;
    name: string;
    authority: Authority;
    auto_renew: boolean;
    active: boolean;
    renewing: boolean;
    renew_failed: boolean;
    not_after: Date;
    updated_at: Date;
    subject: Subject;
    domains: string[];
    addresses: (IPv4 | IPv6)[];
  }

  enum Authority {
    LetsEncrypt = 1,
    Custom = 2,
    DN42 = 3,
  }

  enum AuthorityString {
    LetsEncrypt = "letsencrypt",
    Custom = "custom",
    DN42 = "dn42",
  }

  function convertStringToAuthority(authority: AuthorityString): Authority {
    switch (authority) {
      case AuthorityString.LetsEncrypt:
        return Authority.LetsEncrypt;
      case AuthorityString.Custom:
        return Authority.Custom;
      case AuthorityString.DN42:
        return Authority.DN42;
      default:
        return Authority.LetsEncrypt;
    }
  }

  interface CreateCertOptions {
    name: string;
    authority: AuthorityString; // A string version is used for select compatibility
    auto_renew: boolean;
    subject: Subject;
    domains: string[];
    addresses: (IPv4 | IPv6)[];
  }

  function optionsToCert(options: CreateCertOptions): Cert {
    return {
      id: 0,
      name: options.name,
      authority: convertStringToAuthority(options.authority),
      auto_renew: options.auto_renew,
      active: true,
      renewing: false,
      renew_failed: false,
      not_after: new Date(),
      updated_at: new Date(),
      subject: options.subject,
      domains: options.domains,
      addresses: options.addresses,
    };
  }

  interface Subject {
    common_name: string; // CN - 2.5.4.3
    country: string; // C - 2.5.4.6
    org: string; // O - 2.5.4.10
    org_unit: string; // OU - 2.5.4.11
    locality: string; // L - 2.5.4.7
    province: string; // ST - 2.5.4.8
  }

  function defaultCreateItem(): CreateCertOptions {
    return {
      name: "",
      authority: AuthorityString.LetsEncrypt,
      auto_renew: true,
      subject: {
        common_name: "",
        country: "",
        org: "",
        org_unit: "",
        locality: "",
        province: "",
      },
      domains: [],
      addresses: [],
    };
  }

  let createItem: CreateCertOptions = defaultCreateItem();
  let createPopup: boolean = false;
  let createErrorMessage: string | null = null;

  function rowOrdering(rows: RestItem<Cert>[], domain: string): RestItem<Cert>[] {
    return rows
      .filter(
        x => domainFilter(x.data.subject.common_name, domain) || x.data.domains.map(x => domainFilter(x, domain)).reduce((a, b) => a || b, false),
      )
      .sort((a, b) => {
        // sort renew failed first
        if (a.data.renew_failed && b.data.renew_failed) return a.data.id - b.data.id;
        if (a.data.renew_failed) return -1;
        if (b.data.renew_failed) return 1;
        return a.data.id - b.data.id;
      });
  }

  function domainFilter(src: string, domain: string) {
    if (domain == "*") return true;
    let n = src.indexOf("/");
    if (n == -1) n = src.length;
    let p = src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

  domainOption.subscribe(() => table.reload());

  function createCertificate() {
    if (createItem == null) return;

    if (createItem.name == "") {
      createErrorMessage = "Missing certificate name";
      return;
    }
    if (createItem.subject.common_name == "") {
      createErrorMessage = "Missing certificate subject common name";
      return;
    }

    table
      .addItem(optionsToCert(createItem))
      .then(() => {
        createPopup = false;
        createItem = defaultCreateItem();
      })
      .catch(x => {
        createErrorMessage = x;
      });
  }

  function parseCountryCode(x: string): x is TCountryCode {
    return x.length === 2;
  }

  function setAutoRenewState(value: RestItem<Cert>, autoRenew: boolean) {
    value.patch({auto_renew: autoRenew}, (x: Cert) => {
      x.auto_renew = autoRenew;
      return x;
    });
  }

  function manualRenew(value: RestItem<Cert>) {
    value.apiCall(
      value.keyUrl() + "/renew",
      {},
      () => {
        value.data.renewing = true;
      },
      {method: "POST"},
    );
  }
</script>

<div class="row">
  <h1>Certificates</h1>
  <button class="create-button" on:click={() => (createPopup = true)}>Create Certificate</button>

  <ActionPopup name="Create Certificate" bind:show={createPopup} on:save={createCertificate}>
    <div class="create-cert-column-wrapper">
      <div class="create-cert-column">
        <div>Name*</div>
        <div><input type="text" class="code-font" bind:value={createItem.name} size={Math.max(30, createItem.name.length + 2)} /></div>
        <div>Authority*</div>
        <div>
          <select class="code-font" bind:value={createItem.authority}>
            <option value="letsencrypt">Let's Encrypt</option>
            <option value="custom">Custom</option>
            <option value="dn42">DN42</option>
          </select>
        </div>
        <div>Auto Renew</div>
        <div><input type="checkbox" bind:checked={createItem.auto_renew} /></div>
        <div>Common Name*</div>
        <div>
          <input
            type="text"
            class="code-font"
            bind:value={createItem.subject.common_name}
            size={Math.max(30, createItem.subject.common_name.length + 2)}
          />
        </div>
      </div>
      <div class="create-cert-column">
        <div>Country</div>
        <div class="country-row">
          <CountrySelect class="code-font" bind:value={createItem.subject.country} id="countries-input" />
          <div class="country-flag">
            {#if parseCountryCode(createItem.subject.country)}
              {getEmojiFlag(createItem.subject.country)}
            {/if}
          </div>
        </div>
        <div>Organisation</div>
        <div><input type="text" class="code-font" bind:value={createItem.subject.org} size={Math.max(30, createItem.subject.org.length + 2)} /></div>
        <div>Organisation Unit</div>
        <div>
          <input type="text" class="code-font" bind:value={createItem.subject.org_unit} size={Math.max(30, createItem.subject.org_unit.length + 2)} />
        </div>
        <div>Locality (City)</div>
        <div>
          <input type="text" class="code-font" bind:value={createItem.subject.locality} size={Math.max(30, createItem.subject.locality.length + 2)} />
        </div>
        <div>Province (State, County)</div>
        <div>
          <input type="text" class="code-font" bind:value={createItem.subject.province} size={Math.max(30, createItem.subject.province.length + 2)} />
        </div>
      </div>
    </div>

    <div class="create-cert-column-wrapper">
      <div class="create-cert-column">
        <div>Domains</div>
        <DynamicListView bind:list={createItem.domains} parser={x => (x != "" ? x.trim() : null)} />
      </div>
      <div class="create-cert-column">
        <div>IP Addresses</div>
        <DynamicListView bind:list={createItem.addresses} parser={x => (Address.isValid(x) ? Address.parse(x) : null)} />
      </div>
    </div>

    {#if createErrorMessage}
      <div>{createErrorMessage}</div>
    {/if}
  </ActionPopup>
</div>

<div style="padding:8px;background-color:#bb7900;">Warning: This is currently still under development</div>

<PromiseTable value={table}>
  <tr slot="headers">
    <th>ID</th>
    <th>Name</th>
    <th>Auto Renew</th>
    <th>Renewing</th>
    <th>Renew Failed</th>
    <th>Not After</th>
    <th>Domains / IP Addresses</th>
    <th></th>
  </tr>

  <svelte:fragment slot="rows" let:value>
    {#each rowOrdering(value.rows, $domainOption) as item}
      <PromiseLike value={item}>
        <tr slot="loading" class="empty-row">
          <td colspan="100">
            <div>Loading...</div>
          </td>
        </tr>

        <tr slot="error" let:reason class="empty-row">
          <td colspan="100">Error loading row for {item.data.id}: {reason}</td>
        </tr>

        <tr slot="ok" let:value class:cert-error={value.data.renew_failed} class="empty-row">
          <td>{value.data.id}</td>
          <td>{value.data.name}</td>
          <td>
            <div class="auto-renew-toggle">
              <button
                class:auto-renew-enabled={value.data.auto_renew}
                title={"Auto Renew " + (value.data.auto_renew ? "Enabled" : "Disabled")}
                on:click={() => setAutoRenewState(value, !value.data.auto_renew)}
              >
                {#if value.data.auto_renew}
                  <RefreshCW />
                {:else}
                  <RefreshCWOff />
                {/if}
              </button>
            </div>
          </td>
          <td>{value.data.renewing}</td>
          <td>{value.data.renew_failed}</td>
          <td>
            <div>{value.data.not_after}</div>
            <div>{Math.round((new Date(value.data.not_after).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until expiry</div>
          </td>
          <td class="branch-cell">
            {#each value.data.domains as domain}
              <div>{domain}</div>
            {/each}
            {#if value.data.addresses}
              {#each value.data.addresses as address}
                <div>{address}</div>
              {/each}
            {/if}
          </td>
          <td>
            <div class="action-row">
              {#if !value.data.auto_renew && !value.data.renewing}
                <div class="manual-renew-button">
                  <button title="Manual Renew" on:click={() => manualRenew(value)}>
                    <RefreshCWWDot />
                  </button>
                </div>
              {/if}
              <ActionMenu data={item} locked={false} edit={null} remove={() => item.remove()} />
            </div>
          </td>
        </tr>
      </PromiseLike>
    {/each}
  </svelte:fragment>
</PromiseTable>

<style lang="scss">
  @import "../values.scss";

  .branch-cell {
    display: grid;
    grid-template-columns: repeat(1, auto);
    justify-content: left;
    padding: 8px 15px;
  }

  .branch-cell {
    min-height: 40px;
    height: auto;
  }

  // css please explain yourself
  tr.cert-error.cert-error {
    &:nth-child(2n + 1) {
      background-color: #51000055;
    }

    &:nth-child(2n) {
      background-color: #33000055;
    }
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .create-button {
    @include button-green-box;
  }

  .create-cert-column-wrapper {
    padding: 16px;
    display: flex;
    flex-direction: row;
    gap: 32px;

    .create-cert-column {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  .country-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;

    :global(input) {
      flex-grow: 1;
    }

    .country-flag {
      aspect-ratio: 1/1;
      font-size: 200%;
    }
  }

  .auto-renew-toggle {
    height: 100%;
    display: flex;

    button {
      display: block;
      height: 100%;

      &.auto-renew-enabled {
        @include button-green;
      }

      &:not(.auto-renew-enabled) {
        @include button-red;
      }
    }
  }

  .manual-renew-button {
    height: 100%;
    display: flex;

    button {
      display: block;
      height: 100%;

      @include button-gold;
    }
  }

  .action-row {
    height: 100%;
    display: flex;
    justify-content: end;
  }
</style>
