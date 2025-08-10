<script lang="ts">
  import {domainOption} from "../stores/domain-option";
  import {
    DnsTypeCAA,
    DnsTypeCNAME,
    DnsTypeMX,
    DnsTypeNS,
    DnsTypeSRV,
    DnsTypeTXT,
    isARecord,
    isAaaaRecord,
    isCaaRecord,
    isCnameRecord,
    isMxRecord,
    isNsRecord,
    isSrvRecord,
    isTxtRecord,
    type AValue,
    type AaaaValue,
    type AnyRecord,
    type AnyValue,
    type ApiRecordFormat,
    type CaaValue,
    type CnameValue,
    type MxValue,
    type NsValue,
    type SrvValue,
    type TxtValue,
  } from "../types/records";
  import {RestItem, RestTable} from "../utils/rest-table";
  import NsRow from "../components/domains/NsRow.svelte";
  import MxRow from "../components/domains/MxRow.svelte";
  import ARow from "../components/domains/ARow.svelte";
  import CnameRow from "../components/domains/CnameRow.svelte";
  import TxtRow from "../components/domains/TxtRow.svelte";
  import CaaRow from "../components/domains/CaaRow.svelte";
  import SrvRow from "../components/domains/SrvRow.svelte";
  import DomainTableView from "./DomainTableView.svelte";
  import NsCreate from "../components/create-domains/NsCreate.svelte";
  import MxCreate from "../components/create-domains/MxCreate.svelte";
  import ACreate from "../components/create-domains/ACreate.svelte";
  import CnameCreate from "../components/create-domains/CnameCreate.svelte";
  import CaaCreate from "../components/create-domains/CaaCreate.svelte";
  import TxtCreate from "../components/create-domains/TxtCreate.svelte";
  import {onMount} from "svelte";
  import {LOGIN} from "../utils/login";
  import type {Zone} from "../types/zone";
  import ActionPopup from "../components/ActionPopup.svelte";

  const apiVerbena = import.meta.env.VITE_API_VERBENA;
  const apiAllZones = apiVerbena + "/zones";
  const apiBotToken = apiVerbena + "/bot-token";

  const table = new RestTable<AnyRecord>(apiVerbena + "/zones/0/records", (item: AnyRecord) => `${item.id}`);

  let allZones: Zone[] = [];
  let currentZone: Zone | undefined;

  async function fetchAllZones() {
    let f = await LOGIN.clientRequest(apiAllZones, {method: "GET"});
    if (f.status != 200) throw new Error("Unexpected status code: " + f.status);
    let fJson = await f.json();
    let rows = fJson as Zone[];
    allZones = rows;
  }

  onMount(() => {
    (async () => {
      await fetchAllZones();
      changeToZone($domainOption);
    })();
  });

  domainOption.subscribe(x => {
    changeToZone(x);
  });

  function changeToZone(x: string) {
    let myZone = allZones.find(zone => zone.name === x);
    currentZone = myZone;
    table.changeUrl(apiVerbena + "/zones/" + (myZone?.id ?? "0") + "/records");
    table.reload();
  }

  function rowOrdering<T extends AnyValue>(
    rows: RestItem<AnyRecord>[],
    isTRecord: (t: AnyRecord) => t is ApiRecordFormat<T>,
  ): RestItem<ApiRecordFormat<T>>[] {
    return rows
      .filter(x => isTRecord(x.data))
      .filter(x => x.data.zone_id === currentZone?.id)
      .sort((a, b) => a.data.name.localeCompare(b.data.name)) as unknown as RestItem<ApiRecordFormat<T>>[];
  }

  let domainTitle: string = "";
  $: (domainTitle = table.rows.length === 0 ? "Unknown" : (currentZone?.name ?? "")), $table;

  let zoneFileUrl: string;
  zoneFileUrl = domainTitle ? `${import.meta.env.VITE_API_VERBENA}/zones/${domainTitle}/zone-file` : "";

  let recordTypes = [
    {
      name: "NS",
      headers: ["Subdomain", "Name Server", "TTL"],
      locked: true,
      filter: isNsRecord,
      render: NsRow,
      create: NsCreate,
      empty: (): ApiRecordFormat<NsValue> => ({
        name: "",
        type: DnsTypeNS,
        ttl: null,
        value: {
          target: "",
        },
      }),
    },
    {
      name: "MX",
      headers: ["Subdomain", "Preference", "Mail Server", "TTL"],
      locked: false,
      filter: isMxRecord,
      render: MxRow,
      create: MxCreate,
      empty: (): ApiRecordFormat<MxValue> => ({
        name: "",
        type: DnsTypeMX,
        ttl: null,
        value: {
          target: "",
          preference: 0,
        },
      }),
    },
    {
      name: "A/AAAA",
      headers: ["Hostname", "IP Address", "TTL"],
      locked: false,
      filter: (t: AnyRecord) => isARecord(t) || isAaaaRecord(t),
      render: ARow,
      create: ACreate,
      empty: (): ApiRecordFormat<AValue | AaaaValue> => ({
        name: "",
        type: "", // this is on purpose
        ttl: null,
        value: {
          ip: "",
        },
      }),
    },
    {
      name: "CNAME",
      headers: ["Hostname", "Aliases to", "TTL"],
      locked: false,
      filter: isCnameRecord,
      render: CnameRow,
      create: CnameCreate,
      empty: (): ApiRecordFormat<CnameValue> => ({
        name: "",
        type: DnsTypeCNAME,
        ttl: null,
        value: {
          target: "",
        },
      }),
    },
    {
      name: "TXT",
      headers: ["Hostname", "Value", "TTL"],
      locked: false,
      filter: isTxtRecord,
      render: TxtRow,
      create: TxtCreate,
      empty: (): ApiRecordFormat<TxtValue> => ({
        name: "",
        type: DnsTypeTXT,
        ttl: null,
        value: {
          text: "",
        },
      }),
    },
    {
      name: "SRV",
      headers: ["Name", "Priority", "Weight", "Port", "Target", "TTL"],
      locked: false,
      filter: isSrvRecord,
      render: SrvRow,
      create: null,
      empty: (): ApiRecordFormat<SrvValue> => ({
        name: "",
        type: DnsTypeSRV,
        ttl: null,
        value: {
          priority: 0,
          weight: 0,
          port: 0,
          target: "",
        },
      }),
    },
    {
      name: "CAA",
      headers: ["Name", "Tag", "Value", "TTL"],
      locked: false,
      filter: isCaaRecord,
      render: CaaRow,
      create: CaaCreate,
      empty: (): ApiRecordFormat<CaaValue> => ({
        name: "",
        type: DnsTypeCAA,
        ttl: null,
        value: {
          flag: 0,
          tag: "",
          value: "",
        },
      }),
    },
  ];

  function toAny(a: any) {
    return a as any;
  }

  let botTokenPopup: boolean = false;

  $: if (!botTokenPopup) {
    botTokenPromise = null;
  }

  let botTokenPromise: Promise<string> | null = null;

  function isText(data: unknown): data is string {
    return typeof data === "string";
  }

  async function fetchBotToken(title: string): Promise<string> {
    botTokenPopup = true;

    let f = await LOGIN.clientRequest(apiBotToken, {method: "POST", body: JSON.stringify({zone: title})});
    if (f.status != 200) throw new Error("Unexpected status code: " + f.status);
    let fJson = await f.json();
    if (!isText(fJson.token)) throw new Error("Unexpected output");
    return fJson.token;
  }
</script>

{#if domainTitle}
  <div class="title-row">
    <h1>Domains / {domainTitle}</h1>
    <a class="zone-download" href={zoneFileUrl} download="{domainTitle}.zone">Download DNS Zone File</a>
    <button class="bot-token-button" on:click={() => (botTokenPromise = fetchBotToken(domainTitle))}>Create Bot Token</button>
  </div>

  <ActionPopup name="Bot API Token" bind:show={botTokenPopup} showButtonRow={false}>
    {#await botTokenPromise}
      <div>Requesting bot token...</div>
    {:then x}
      <div style="user-select: none;">
        Token: <span class="bot-token-selection">{x}</span>
      </div>
    {:catch err}
      <div>Failed to request bot token: {err}</div>
    {/await}
  </ActionPopup>
{/if}

{#each recordTypes as recordType}
  <DomainTableView recordName={recordType.name} table={$table} emptyRecord={recordType.empty} {rowOrdering} isTRecord={recordType.filter}>
    <tr slot="headers">
      {#each recordType.headers as header}
        <th>{header}</th>
      {/each}
      <th></th>
    </tr>

    <svelte:fragment slot="create" let:editItem let:editMode>
      {#if recordType.create != null && recordType.empty != null}
        <svelte:component this={recordType.create} editItem={toAny(editItem)} {editMode} />
      {/if}
    </svelte:fragment>

    <svelte:component this={recordType.render} slot="row" let:value item={value} locked={recordType.locked} />
  </DomainTableView>
{/each}

<style lang="scss">
  @import "../values.scss";

  .title-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .zone-download {
      @include button-green-invert-box;
    }

    .bot-token-button {
      @include button-green-box;
    }
  }

  .bot-token-selection {
    -webkit-touch-callout: all; /* iOS Safari */
    -webkit-user-select: all; /* Safari */
    -khtml-user-select: all; /* Konqueror HTML */
    -moz-user-select: all; /* Firefox */
    -ms-user-select: all; /* Internet Explorer/Edge */
    user-select: all; /* Chrome and Opera */
  }
</style>
