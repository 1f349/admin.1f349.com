import type {Subscriber, Unsubscriber} from "svelte/store";
import type {IPromiseLike} from "../utils/promise-like";
import {LOGIN} from "./login";

export class RestTable<T extends object> implements IPromiseLike<RestTable<T>> {
  apiUrl: string;
  keyFunc: (item: T) => string;
  rows: Array<RestItem<T>>;
  private errorReason: string | null = null;
  private loading: boolean = false;
  private subs: Set<Subscriber<RestTable<T>>> = new Set();

  constructor(apiUrl: string, keyFunc: (item: T) => string) {
    this.apiUrl = apiUrl;
    this.keyFunc = keyFunc;
    this.rows = [];
  }

  changeUrl(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  updateSubs() {
    this.subs.forEach(x => x(this));
  }

  isLoading(): boolean {
    return this.loading;
  }

  error(): string | null {
    return this.errorReason;
  }

  makeItem(x: T): RestItem<T> {
    return new RestItem(this, x);
  }

  reload() {
    (async () => {
      try {
        this.loading = true;
        this.updateSubs();
        let f = await LOGIN.clientRequest(this.apiUrl, {method: "GET"});
        if (f.status != 200) throw new Error("Unexpected status code: " + f.status);
        let fJson = await f.json();
        let rows = fJson as T[];
        this.rows = rows.map(x => this.makeItem(x));
        this.loading = false;
        this.updateSubs();
      } catch (err) {
        console.log("Setting error reason");
        console.log(err);
        this.errorReason = (err as Error).message;
        this.loading = false;
        this.updateSubs();
      }
    })();
  }

  async addItem(item: T): Promise<void> {
    let f = await LOGIN.clientRequest(this.apiUrl, {method: "POST", body: JSON.stringify(item)});
    if (f.status !== 200 && f.status !== 201) throw new Error("Unexpected status code: " + f.status);
    this.rows.push(new RestItem(this, item));
    this.updateSubs();
  }

  subscribe(run: Subscriber<RestTable<T>>): Unsubscriber {
    this.subs.add(run);
    run(this);
    return () => this.subs.delete(run);
  }
}

export class RestItem<T extends object> implements IPromiseLike<RestItem<T>> {
  table: RestTable<T>;
  data: T;
  private errorReason: string | null = null;
  private loading: boolean = false;
  private subs: Set<Subscriber<RestItem<T>>> = new Set();

  constructor(table: RestTable<T>, data: T) {
    this.table = table;
    this.data = data;
  }

  updateSubs() {
    this.subs.forEach(x => x(this));
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.updateSubs();
  }

  setErrorReason(errorReason: string) {
    this.errorReason = errorReason;
  }

  key(): string {
    return this.table.keyFunc(this.data);
  }

  keyUrl(): string {
    let keyPath = "/" + this.key();
    if (keyPath === "/") keyPath = "";
    return this.table.apiUrl + keyPath;
  }

  isLoading(): boolean {
    return this.loading;
  }

  error(): string | null {
    return this.errorReason;
  }

  async update(data: T, options?: RequestInit): Promise<void> {
    this.setLoading(true);
    if (!options)
      options = {
        method: "PUT",
        body: JSON.stringify(this.data),
      };
    try {
      const x = await LOGIN.clientRequest(this.keyUrl(), options);
      if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
      this.data = data;
      this.setLoading(false);
    } catch (err) {
      this.setErrorReason("Failed to update item " + this.key());
      this.setLoading(false);
    }
  }

  async remove(options?: RequestInit): Promise<void> {
    this.setLoading(true);
    if (!options) options = {method: "DELETE"};
    try {
      const x = await LOGIN.clientRequest(this.keyUrl(), options);
      if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
      this.table.rows = this.table.rows.filter(x_1 => this.table.keyFunc(x_1.data) !== this.key());
      this.table.updateSubs();
      this.setLoading(false);
    } catch (err) {
      this.setErrorReason("Failed to remove item " + this.key());
      this.setLoading(false);
    }
  }

  subscribe(run: Subscriber<RestItem<T>>): Unsubscriber {
    this.subs.add(run);
    run(this);
    return () => this.subs.delete(run);
  }
}
