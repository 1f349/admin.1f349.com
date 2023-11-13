import {writable} from "svelte/store";

export interface Site {
  domain: string;
  branches: string[];
}

export function siteEqual(a: Site | null, b: Site | null) {
  if (a == null || b == null) return false;
  return a.domain == b.domain;
}

export const sitesTable = writable<{[key: string]: Site}>({});
