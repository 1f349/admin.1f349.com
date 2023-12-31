export interface Route {
  src: string;
  dst: string;
  desc: string;
  flags: number;
  active: boolean;
}

export interface Redirect {
  src: string;
  dst: string;
  desc: string;
  flags: number;
  code: number;
  active: boolean;
}

export function routeEqual(a: Route | null, b: Route | null): boolean {
  if (a == null || b == null) return false;
  return a.src === b.src && a.dst === b.dst && a.desc === b.desc && a.flags === b.flags && a.active === b.active;
}

export function redirectEqual(a: Redirect | null, b: Redirect | null): boolean {
  if (a == null || b == null) return false;
  return a.src === b.src && a.dst === b.dst && a.desc === b.desc && a.flags === b.flags && a.code === b.code && a.active === b.active;
}

export const routeKeys = [
  {char: "p", name: "Prefix Path"},
  {char: "a", name: "Absolute Path"},
  {char: "c", name: "CORS"},
  {char: "s", name: "Secure Mode"},
  {char: "h", name: "Forward Host"},
  {char: "f", name: "Forward Address"},
  {char: "i", name: "Ignore Certificate"},
  {char: "w", name: "Websocket"},
];

export const redirectKeys = [
  {char: "p", name: "Prefix Path"},
  {char: "a", name: "Absolute Path"},
];
