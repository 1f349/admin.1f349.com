import {writable} from "svelte/store";
import type {CSPair} from "../types/cspair";
import type {Pair} from "../utils/pair";
import type {Redirect, Route} from "../types/target";

export const routesTable = writable<{[key: string]: CSPair<Route>}>({});
export const redirectsTable = writable<{[key: string]: CSPair<Redirect>}>({});

function getTableArray<T>(table: {[key: string]: CSPair<T>}, keys: Array<string>): Array<Pair<string, CSPair<T>>> {
  return keys.map(x => ({a: x, b: table[x]}));
}

export interface CountStats {
  created: number;
  modified: number;
  removed: number;
}

export function tableCountStats<T>(table: {[key: string]: CSPair<T>}, keys: Array<string>, equality: (a: T, b: T) => boolean): CountStats {
  let list = getTableArray(table, keys)
    .map(x => x.b)
    .filter(x => x.client != null || x.server != null);
  return {
    created: list.filter(x => x.server == null).length,
    modified: list.filter(x => x.server != null && x.client != null && !equality(x.client, x.server)).length,
    removed: list.filter(x => x.client == null).length,
  };
}
