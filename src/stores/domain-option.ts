import { writable } from "svelte/store";

export const domainOption = writable<string>("*");
