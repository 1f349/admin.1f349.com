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

  private updateSubs() {
    this.subs.forEach(x => x(this));
  }

  isLoading(): boolean {
    return this.loading;
  }

  error(): string | null {
    return this.errorReason;
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
        this.rows = rows.map(x => new RestItem(this, x));
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

  addItem(item: T) {
    (async () => {
      let f = await LOGIN.clientRequest(this.apiUrl, {method: "POST"});
      if (f.status !== 200) throw new Error("Unexpected status code: " + f.status);
      this.rows.push(new RestItem(this, item));
      this.updateSubs();
    })();
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

  private updateSubs() {
    this.subs.forEach(x => x(this));
  }

  key(): string {
    return this.table.keyFunc(this.data);
  }

  isLoading(): boolean {
    return this.loading;
  }

  error(): string | null {
    return this.errorReason;
  }

  update(data: T): Promise<void> {
    this.loading = true;
    this.updateSubs();
    return LOGIN.clientRequest(this.table.apiUrl + "/" + this.key(), {
      method: "PUT",
      body: JSON.stringify(this.data),
    })
      .then(x => {
        if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        this.data = data;
        this.loading = false;
        this.updateSubs();
      })
      .catch(x => {
        this.loading = false;
        this.updateSubs();
      });
  }

  remove(): Promise<void> {
    this.loading = true;
    this.updateSubs();
    return LOGIN.clientRequest(this.table.apiUrl + "/" + this.key(), {method: "DELETE"})
      .then(x => {
        if (x.status !== 200) throw new Error("Unexpected status code: " + x.status);
        this.table.rows = this.table.rows.filter(x => this.table.keyFunc(x.data) !== this.key());
        this.loading = false;
        this.updateSubs();
      })
      .catch(x => {
        this.errorReason = "Failed to remove item " + this.table.keyFunc(this.data);
        this.loading = false;
        this.updateSubs();
      });
  }

  subscribe(run: Subscriber<RestItem<T>>): Unsubscriber {
    this.subs.add(run);
    run(this);
    return () => this.subs.delete(run);
  }
}
