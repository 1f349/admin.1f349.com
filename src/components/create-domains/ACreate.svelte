<script lang="ts">
  import {DnsTypeA, DnsTypeAAAA, type AaaaRecord, type ARecord} from "../../types/records";
  import {IPv4, IPv6, parse as parseAddr} from "ipaddr.js";

  export let editItem: ARecord | AaaaRecord;
  export let editMode: boolean;

  let value: string = "";

  function onChange() {
    try {
      let addr = parseAddr(value);
      if (addr instanceof IPv4) {
        (editItem as ARecord).A = addr.toString();
        editItem.Hdr.Rrtype = DnsTypeA;
      } else if (addr instanceof IPv6) {
        (editItem as AaaaRecord).AAAA = addr.toString();
        editItem.Hdr.Rrtype = DnsTypeAAAA;
      }
    } catch {
      editItem.Hdr.Rrtype = 0;
      console.error("Invalid IP address:", value);
    }
  }
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.Hdr.Name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.Hdr.Name} size={Math.max(20, editItem.Hdr.Name.length + 2)} /></div>
{/if}

<div>IP Address</div>
<div><input type="text" class="code-font" bind:value on:keyup={onChange} size={Math.max(20, value.length + 2)} /></div>
{#if editItem.Hdr.Rrtype === DnsTypeA}
  <div>IP address is IPv4</div>
{:else if editItem.Hdr.Rrtype === DnsTypeAAAA}
  <div>IP address is IPv6</div>
{/if}
