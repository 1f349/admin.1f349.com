<script lang="ts">
  import {domainOption} from "../stores/domain-option";
  import {
    DnsTypeA,
    DnsTypeCAA,
    DnsTypeCNAME,
    DnsTypeMX,
    DnsTypeNS,
    DnsTypeSOA,
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
    type ARecord,
    type AaaaRecord,
    type AllRecords,
    type CaaRecord,
    type CnameRecord,
    type MxRecord,
    type NsRecord,
    type SoaRecord,
    type SrvRecord,
    type TxtRecord,
    type UnknownRecord,
  } from "../types/records";
  import {RestItem, RestTable} from "../utils/rest-table";
  import PromiseLike from "../components/PromiseLike.svelte";
  import SoaRow from "../components/domains/SoaRow.svelte";
  import NsRow from "../components/domains/NsRow.svelte";
  import MxRow from "../components/domains/MxRow.svelte";
  import ARow from "../components/domains/ARow.svelte";
  import CnameRow from "../components/domains/CnameRow.svelte";
  import TxtRow from "../components/domains/TxtRow.svelte";
  import CaaRow from "../components/domains/CaaRow.svelte";
  import SrvRow from "../components/domains/SrvRow.svelte";
  import DomainTableView from "./DomainTableView.svelte";
  import ActionPopup from "../components/ActionPopup.svelte";
  import NsCreate from "../components/create-domains/NsCreate.svelte";
  import MxCreate from "../components/create-domains/MxCreate.svelte";
  import ACreate from "../components/create-domains/ACreate.svelte";
  import CnameCreate from "../components/create-domains/CnameCreate.svelte";
  import CaaCreate from "../components/create-domains/CaaCreate.svelte";
  import TxtCreate from "../components/create-domains/TxtCreate.svelte";

  const apiAzalea = import.meta.env.VITE_API_AZALEA;

  const table = new RestTable<AllRecords>(apiAzalea + "/domains/" + $domainOption + "/records", (item: AllRecords) => item.Hdr.Name);

  function rowOrdering<T extends UnknownRecord>(
    rows: RestItem<AllRecords>[],
    domain: string,
    isTRecord: (t: UnknownRecord) => t is T,
  ): RestItem<T>[] {
    return rows
      .filter(x => isTRecord(x.data))
      .filter(x => domainFilter(x.data.Hdr.Name, domain))
      .sort((a, b) => a.data.Hdr.Name.localeCompare(b.data.Hdr.Name)) as unknown as RestItem<T>[];
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

  let soaRecords: SoaRecord[] = [
    {
      Hdr: {
        Name: "example.com.",
        Rrtype: DnsTypeSOA,
        Class: 1,
        Ttl: 300,
      },
      Ns: "ns1.example.com.",
      Mbox: "postmaster.example.com.",
      Serial: 0,
      Refresh: 0,
      Retry: 0,
      Expire: 0,
      Minttl: 0,
    },
  ];
  let domainTitle: string = getTitleDomain(soaRecords[0].Hdr.Name);
  let zoneFileUrl: string = `${import.meta.env.VITE_API_AZALEA}/domains/${domainTitle}/zone-file`;

  let recordTypes = [
    {
      name: "SOA",
      headers: ["Primary Domain", "Email", "Default TTL", "Refresh Rate", "Retry Rate", "Expire Time"],
      filter: isSoaRecord,
      render: SoaRow,
      create: null,
      save: null,
      empty: null,
    },
    {
      name: "NS",
      headers: ["Subdomain", "Name Server", "TTL"],
      filter: isNsRecord,
      render: NsRow,
      create: NsCreate,
      empty: (): NsRecord => ({
        Hdr: {
          Name: "",
          Rrtype: DnsTypeNS,
          Class: 1,
          Ttl: 0,
        },
        Ns: "",
      }),
    },
    {
      name: "MX",
      headers: ["Mail Server", "Preference", "Subdomain", "TTL"],
      filter: isMxRecord,
      render: MxRow,
      create: MxCreate,
      empty: (): MxRecord => ({
        Hdr: {
          Name: "",
          Rrtype: DnsTypeMX,
          Class: 1,
          Ttl: 0,
        },
        Mx: "",
        Preference: 0,
      }),
    },
    {
      name: "A/AAAA",
      headers: ["Hostname", "IP Address", "TTL"],
      filter: (t: UnknownRecord) => isARecord(t) || isAaaaRecord(t),
      render: ARow,
      create: ACreate,
      empty: (): ARecord | AaaaRecord => ({
        Hdr: {
          Name: "",
          Rrtype: 0, // this is on purpose
          Class: 1,
          Ttl: 0,
        },
        A: "",
        AAAA: "",
      }),
    },
    {
      name: "CNAME",
      headers: ["Hostname", "Aliases to", "TTL"],
      filter: isCnameRecord,
      render: CnameRow,
      create: CnameCreate,
      empty: (): CnameRecord => ({
        Hdr: {
          Name: "",
          Rrtype: DnsTypeCNAME,
          Class: 1,
          Ttl: 0,
        },
        Target: "",
      }),
    },
    {
      name: "TXT",
      headers: ["Hostname", "Value", "TTL"],
      filter: isTxtRecord,
      render: TxtRow,
      create: TxtCreate,
      empty: (): TxtRecord => ({
        Hdr: {
          Name: "",
          Rrtype: DnsTypeTXT,
          Class: 1,
          Ttl: 0,
        },
        Txt: [""],
      }),
    },
    {
      name: "SRV",
      headers: ["Name", "Priority", "Weight", "Port", "Target", "TTL"],
      filter: isSrvRecord,
      render: SrvRow,
      create: null,
      empty: (): SrvRecord => ({
        Hdr: {
          Name: "",
          Rrtype: DnsTypeSRV,
          Class: 1,
          Ttl: 0,
        },
        Priority: 0,
        Weight: 0,
        Port: 0,
        Target: "",
      }),
    },
    {
      name: "CAA",
      headers: ["Name", "Tag", "Value", "TTL"],
      filter: isCaaRecord,
      render: CaaRow,
      create: CaaCreate,
      empty: (): CaaRecord => ({
        Hdr: {
          Name: "",
          Rrtype: DnsTypeCAA,
          Class: 1,
          Ttl: 0,
        },
        Flag: 0,
        Tag: "",
        Value: "",
      }),
    },
  ];

  function toAny(a: any) {
    return a as any;
  }
</script>

{#if soaRecords.length >= 1}
  <div class="title-row">
    <h1>Domains / {domainTitle}</h1>
    <a class="zone-download" href={zoneFileUrl} download="{domainTitle}.zone">Download DNS Zone File</a>
  </div>
{/if}

{#each recordTypes as recordType}
  <DomainTableView recordName={recordType.name} {table} emptyRecord={recordType.empty} {rowOrdering} isTRecord={recordType.filter}>
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

    <svelte:component this={recordType.render} slot="row" let:value {value} />
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
