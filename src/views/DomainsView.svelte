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
    isSoaRecord,
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
  import SoaRow from "../components/domains/SoaRow.svelte";
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

  const apiAzalea = import.meta.env.VITE_API_AZALEA;

  const table = new RestTable<AnyRecord>(apiAzalea + "/domains/" + $domainOption + "/records", (item: AnyRecord) => item.id);

  domainOption.subscribe(x => {
    table.changeUrl(apiAzalea + "/domains/" + x + "/records");
    table.reload();
  });

  function rowOrdering<T extends AnyValue>(
    rows: RestItem<AnyRecord>[],
    domain: string,
    isTRecord: (t: AnyRecord) => t is ApiRecordFormat<T>,
  ): RestItem<ApiRecordFormat<T>>[] {
    return rows
      .filter(x => isTRecord(x.data))
      .filter(x => domainFilter(x.data.name, domain))
      .sort((a, b) => a.data.name.localeCompare(b.data.name)) as unknown as RestItem<ApiRecordFormat<T>>[];
  }

  function domainFilter(src: string, domain: string) {
    domain = fqdn(domain);
    if (domain == "*") return true;
    let n = src.indexOf("/");
    if (n == -1) n = src.length;
    let p = src.slice(0, n);
    if (p == domain) return true;
    return p.endsWith(domain);
  }

  domainOption.subscribe(() => table.reload());

  function getTitleDomain(name: string): string {
    if (name.endsWith(".")) {
      return name.substring(0, name.length - 1);
    }
    return name;
  }

  function fqdn(domain: string): string {
    if (domain.endsWith(".")) return domain;
    return domain + ".";
  }

  let domainTitle: string = "";
  $: (domainTitle = table.rows.length === 0 ? "Unknown" : getTitleDomain(table.rows[0].data.name)), $table;
  let zoneFileUrl: string;
  zoneFileUrl = domainTitle ? `${import.meta.env.VITE_API_AZALEA}/domains/${domainTitle}/zone-file` : "";

  let recordTypes = [
    {
      name: "SOA",
      headers: ["Primary Domain", "Email", "Default TTL", "Refresh Rate", "Retry Rate", "Expire Time"],
      locked: true,
      filter: isSoaRecord,
      render: SoaRow,
      create: null,
      save: null,
      empty: null,
    },
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
        value: "",
      }),
    },
    {
      name: "MX",
      headers: ["Mail Server", "Preference", "Subdomain", "TTL"],
      locked: false,
      filter: isMxRecord,
      render: MxRow,
      create: MxCreate,
      empty: (): ApiRecordFormat<MxValue> => ({
        name: "",
        type: DnsTypeMX,
        ttl: null,
        value: {
          mx: "",
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
        type: 0, // this is on purpose
        ttl: null,
        value: "",
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
        value: "",
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
        value: "",
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

  recordTypes[1].empty = null;

  function toAny(a: any) {
    return a as any;
  }
</script>

{#if domainTitle}
  <div class="title-row">
    <h1>Domains / {domainTitle}</h1>
    <a class="zone-download" href={zoneFileUrl} download="{domainTitle}.zone">Download DNS Zone File</a>
  </div>
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
  }
</style>
