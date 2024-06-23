export interface Route {
  src: string;
  dst: string;
  flags: number;
  active: boolean;
}

export interface Redirect {
  src: string;
  dst: string;
  flags: number;
  code: number;
  active: boolean;
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
