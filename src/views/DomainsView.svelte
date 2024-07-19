<script lang="ts">
  import {LOGIN} from "../utils/login";
  import {domainOption} from "../stores/domain-option";
  import {
    DnsTypeSOA,
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
    type CaaRecord,
    type CnameRecord,
    type MxRecord,
    type NsRecord,
    type SoaRecord,
    type SrvRecord,
    type TxtRecord,
    type UnknownRecord,
  } from "../stores/records";
  import ActionMenu from "../components/ActionMenu.svelte";
  import PromiseTable from "../components/PromiseTable.svelte";
  import {RestItem, RestTable} from "../utils/rest-table";
  import PromiseLike from "../components/PromiseLike.svelte";
  import SoaRow from "../components/domains/SoaRow.svelte";

  const apiAzalea = import.meta.env.VITE_API_AZALEA;

  type AllRecords = SoaRecord | NsRecord | MxRecord | ARecord | AaaaRecord | CnameRecord | TxtRecord | SrvRecord | CaaRecord;

  const table = new RestTable<AllRecords>(apiAzalea + "/domains/" + $domainOption + "/records", (item: AllRecords) => item.Hdr.Name);

  function rowOrdering<T extends UnknownRecord>(
    rows: RestItem<UnknownRecord>[],
    domain: string,
    isTRecord: (t: UnknownRecord) => t is T,
  ): RestItem<T>[] {
    return rows
      .filter(x => isTRecord(x.data))
      .filter(x => domainFilter(x.data.Hdr.Name, domain))
      .sort((a, b) => a.data.Hdr.Name.localeCompare(b.data.Hdr.Name)) as unknown as RestItem<T>[];
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

  function getTitleDomain(name: string): string {
    if (name.endsWith(".")) {
      return name.substring(0, name.length - 1);
    }
    return name;
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
</script>

{#if soaRecords.length >= 1}
  <div class="title-row">
    <h1>Domains / {getTitleDomain(soaRecords[0].Hdr.Name)}</h1>
    <a
      class="zone-download"
      href="{import.meta.env.VITE_API_AZALEA}/domains/{getTitleDomain($soaRecords[0].Hdr.Name)}/zone-file"
      download="{getTitleDomain($soaRecords[0].Hdr.Name)}.zone"
    >
      Download DNS Zone File
    </a>
  </div>
{/if}

<h2>SOA Record</h2>
<PromiseTable value={table}>
  <tr slot="headers">
    <th>Primary Domain</th>
    <th>Email</th>
    <th>Default TTL</th>
    <th>Refresh Rate</th>
    <th>Retry Rate</th>
    <th>Expire Time</th>
    <th></th>
  </tr>

  <svelte:fragment slot="rows" let:value>
    {#each rowOrdering(value.rows, $domainOption, DnsTypeSOA) as item}
      <PromiseLike value={item}>
        <tr slot="loading" class="empty-row">
          <td colspan="100">
            <div>Loading...</div>
          </td>
        </tr>

        <tr slot="error" let:reason class="empty-row">
          <td colspan="100">Error loading row for {item.data.Hdr.Name}: {reason}</td>
        </tr>

        <SoaRow slot="ok" let:value {value} />
      </PromiseLike>
    {/each}
  </svelte:fragment>
</PromiseTable>
<table class="action-table" aria-label="List of Domains SOA Record">
  <thead>
    <tr>
      <th>Primary Domain</th>
      <th>Email</th>
      <th>Default TTL</th>
      <th>Refresh Rate</th>
      <th>Retry Rate</th>
      <th>Expire Time</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $soaRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $soaRecords as record}
      <tr>
        <td>{record.Hdr.Name}</td>
        <td>{record.Mbox}</td>
        <td>{record.Minttl}</td>
        <td>{record.Refresh}</td>
        <td>{record.Retry}</td>
        <td>{record.Expire}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={null} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>NS Record</h2>
<table class="action-table" aria-label="List of Domains NS Record">
  <thead>
    <tr>
      <th>Name Server</th>
      <th>Subdomain</th>
      <th>TTL</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $nsRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $nsRecords as record}
      <tr>
        <td>{record.Ns}</td>
        <td>{record.Hdr.Name}</td>
        <td>{record.Hdr.Ttl}</td>
        <td></td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>MX Record</h2>
<table class="action-table" aria-label="List of Domains MX Record">
  <thead>
    <tr>
      <th>Mail Server</th>
      <th>Preference</th>
      <th>Subdomain</th>
      <th>TTL</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $mxRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $mxRecords as record}
      <tr>
        <td>{record.Mx}</td>
        <td>{record.Preference}</td>
        <td>{record.Hdr.Name}</td>
        <td>{record.Hdr.Ttl}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={t => console.log(t)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>A/AAAA Record</h2>
<table class="action-table" aria-label="List of Domains A/AAAA Record">
  <thead>
    <tr>
      <th>Hostname</th>
      <th>IP Address</th>
      <th>TTL</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $aRecords.length === 0 && $aaaaRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $aRecords as record}
      <tr>
        <td>{record.Hdr.Name}</td>
        <td>{record.A}</td>
        <td>{record.Hdr.Ttl}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={t => console.log(t)} />
        </td>
      </tr>
    {/each}
    {#each $aaaaRecords as record}
      <tr>
        <td>{record.Hdr.Name}</td>
        <td>{record.AAAA}</td>
        <td>{record.Hdr.Ttl}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={t => console.log(t)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>CNAME Record</h2>
<table class="action-table" aria-label="List of Domains CNAME Record">
  <thead>
    <tr>
      <th>Hostname</th>
      <th>Aliases to</th>
      <th>TTL</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $cnameRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $cnameRecords as record}
      <tr>
        <td>{record.Hdr.Name}</td>
        <td>{record.Target}</td>
        <td>{record.Hdr.Ttl}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={t => console.log(t)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>TXT Record</h2>
<table class="action-table" aria-label="List of Domains TXT Record">
  <thead>
    <tr>
      <th>Hostname</th>
      <th>Value</th>
      <th>TTL</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $txtRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $txtRecords as record}
      <tr>
        <td>{record.Hdr.Name}</td>
        <td>
          <span class="cutoff">{record.Txt.join("\n")}</span>
        </td>
        <td>{record.Hdr.Ttl}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={t => console.log(t)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>SRV Record</h2>
<table class="action-table" aria-label="List of Domains SRV Record">
  <thead>
    <tr>
      <th>Name</th>
      <th>Priority</th>
      <th>Weight</th>
      <th>Port</th>
      <th>Target</th>
      <th>TTL</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $srvRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $srvRecords as record}
      <tr>
        <td>{record.Hdr.Name}</td>
        <td>{record.Priority}</td>
        <td>{record.Weight}</td>
        <td>{record.Port}</td>
        <td>{record.Target}</td>
        <td>{record.Hdr.Ttl}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={t => console.log(t)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>CAA Record</h2>
<table class="action-table" aria-label="List of Domains CAA Record">
  <thead>
    <tr>
      <th>Name</th>
      <th>Tag</th>
      <th>Value</th>
      <th>TTL</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#if $caaRecords.length === 0}
      <tr class="empty-row"><td colspan="7">No items to display</td></tr>
    {/if}
    {#each $caaRecords as record}
      <tr>
        <td>{record.Hdr.Name}</td>
        <td>{record.Tag}</td>
        <td>{record.Value}</td>
        <td>{record.Hdr.Ttl}</td>
        <td>
          <ActionMenu data={record} edit={t => console.log(t)} remove={t => console.log(t)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  @import "../values.scss";

  button.action-menu {
    @include button-green-highlight;
  }

  table tbody tr {
    td {
      position: relative;

      span.cutoff {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        overflow: hidden;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        margin-inline: 15px;
        display: inline-block;
        vertical-align: middle;
        line-height: 1rem;
        transform: translateY(-50%);
      }
    }

    &.empty-row td {
      text-align: center;
    }
  }

  .title-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .zone-download {
      @include button-green-invert-box;
    }
  }
</style>
