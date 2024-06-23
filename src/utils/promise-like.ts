import type {Readable} from "svelte/store";

export interface IPromiseLike<T> extends Readable<T> {
  isLoading(): boolean;
  error(): string | null;
}
