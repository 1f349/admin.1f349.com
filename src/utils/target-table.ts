import {RestItem, RestTable} from "./rest-table";

interface Target {
  src: string;
}

export class TargetTable<T extends Target> extends RestTable<T> {
  constructor(apiUrl: string, keyFunc: (item: T) => string) {
    super(apiUrl, keyFunc, _ => "");
  }

  makeItem(x: T): RestItem<T> {
    return new TargetItem(this, x);
  }
}

export class TargetItem<T extends Target> extends RestItem<T> {
  constructor(table: TargetTable<T>, data: T) {
    super(table, data);
  }

  update(data: T): Promise<void> {
    return super.update(data, {method: "POST", body: JSON.stringify({...data, src: data.src})});
  }

  remove(): Promise<void> {
    return super.remove({method: "DELETE", body: JSON.stringify({src: this.data.src})});
  }
}
