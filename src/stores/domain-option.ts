import {derived, writable} from "svelte/store";
import {loginStore, parseJwt, type LoginStore} from "./login";

export const domainOptions = derived([loginStore], ([$loginStore]) => {
  return getDomainOptions($loginStore);
});

const internalDomainOption = writable<string>(localStorage.getItem("domain-option") || "");

export const domainOption = derived([domainOptions, internalDomainOption], ([$domainOptions, $internalDomainOption]) => {
  return $domainOptions.find(x => x === $internalDomainOption) || $domainOptions[0] || "";
});

function getDomainOptions(login: LoginStore | null): string[] {
  let accessToken = login?.tokens?.access;
  if (accessToken == null) return [];
  let jwt = parseJwt(accessToken);
  if (!jwt) return [];
  return jwt.per.filter((x: string) => x.startsWith("domain:owns=")).map((x: string) => x.slice("domain:owns=".length));
}

export function setDomainOption(domain: string) {
  internalDomainOption.set(domain);
  localStorage.setItem("domain-option", domain);
}
