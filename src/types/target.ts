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
  active: boolean;
}

export function routeEqual(a: Route, b: Route): boolean {
  if (b == null) return false;
  return a.src === b.src && a.dst === b.dst && a.desc === b.desc && a.flags === b.flags && a.active === b.active;
}

export function redirectEqual(a: Redirect, b: Redirect): boolean {
  if (b == null) return false;
  return a.src === b.src && a.dst === b.dst && a.desc === b.desc && a.flags === b.flags && a.active === b.active;
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
