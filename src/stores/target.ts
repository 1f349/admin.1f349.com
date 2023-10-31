import {writable} from "svelte/store";
import type {CSPair} from "../types/cspair";
import type {Redirect, Route} from "../types/target";

export const routesTable = writable<{[key: string]: CSPair<Route>}>({});
export const redirectsTable = writable<{[key: string]: CSPair<Redirect>}>({});
