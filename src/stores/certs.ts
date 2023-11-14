import {writable} from "svelte/store";

export interface Cert {
  id: number;
  auto_renew: boolean;
  active: boolean;
  renewing: boolean;
  renew_failed: boolean;
  not_after: string;
  updated_at: string;
  domains: string[];
}

export function siteEqual(a: Cert | null, b: Cert | null) {
  if (a == null || b == null) return false;
  a.domains.sort();
  b.domains.sort();
  return (
    a.id == b.id &&
    a.auto_renew == b.auto_renew &&
    a.active == b.active &&
    a.renewing == b.renewing &&
    a.renew_failed == b.renew_failed &&
    a.not_after == b.not_after &&
    a.updated_at == b.updated_at &&
    JSON.stringify(a.domains) == JSON.stringify(b.domains)
  );
}

export const certsTable = writable<{[key: string]: Cert}>({});
