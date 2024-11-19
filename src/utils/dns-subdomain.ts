import {get} from "svelte/store";
import {domainOption} from "../stores/domain-option";

export function dnsFqdn(domain: string): string {
  if (domain.endsWith(".")) return domain;
  return domain + ".";
}

export function dnsSubdomain(value: string): string {
  let baseDomain = dnsFqdn(get(domainOption));

  if (value == baseDomain) value = "";
  else if (value.endsWith("." + baseDomain)) value = value.substring(0, value.length - baseDomain.length - 1);

  switch (value) {
    case "":
      return ".";
    case "*":
      return "*";
    default:
      return value;
  }
}
