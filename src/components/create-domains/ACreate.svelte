<script lang="ts">
  import {DnsTypeA, DnsTypeAAAA, type AaaaValue, type ApiRecordFormat, type AValue} from "../../types/records";
  import {IPv4, IPv6, parse as parseAddr} from "ipaddr.js";

  export let editItem: ApiRecordFormat<AValue | AaaaValue>;
  export let editMode: boolean;

  let value: string = "";

  function onChange() {
    try {
      let addr = parseAddr(value);
      if (addr instanceof IPv4) {
        (editItem as ApiRecordFormat<AValue>).value = addr.toString();
        editItem.type = DnsTypeA;
      } else if (addr instanceof IPv6) {
        (editItem as ApiRecordFormat<AaaaValue>).value = addr.toString();
        editItem.type = DnsTypeAAAA;
      }
    } catch {
      editItem.type = 0;
    }
  }
</script>

<div>Name</div>
{#if editMode}
  <div class="code-font">{editItem.name}</div>
{:else}
  <div><input type="text" class="code-font" bind:value={editItem.name} size={Math.max(20, editItem.name.length + 2)} /></div>
{/if}

<div>IP Address</div>
<div><input type="text" class="code-font" bind:value on:keyup={onChange} size={Math.max(20, value.length + 2)} /></div>
{#if editItem.type === DnsTypeA}
  <div>IP address is IPv4</div>
{:else if editItem.type === DnsTypeAAAA}
  <div>IP address is IPv6</div>
{:else}
  <div>Invalid IP address</div>
{/if}
