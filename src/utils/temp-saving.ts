export function tempSave(key: string, value: object) {
  localStorage.setItem("temp-" + key, JSON.stringify(value));
}

export function tempGet<T>(key: string): T | null {
  let v = localStorage.getItem("temp-" + key);
  if (v == null) return null;
  return JSON.parse(v) as T;
}

export function tempClear(key: string) {
  localStorage.removeItem("temp-" + key);
}
