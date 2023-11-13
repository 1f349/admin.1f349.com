export type CSPair<T> = CSPairYesC<T> | CSPairYesS<T>;
export type CSPairNotC<T> = {client: null; server: T; p: Promise<void>};
export type CSPairNotS<T> = {client: T; server: null; p: Promise<void>};
export type CSPairYesC<T> = {client: T; server: T | null; p: Promise<void>};
export type CSPairYesS<T> = {client: T | null; server: T; p: Promise<void>};

export function noPair<T>(pair: CSPair<T>): boolean {
  return pair.client == null || pair.server == null;
}

export function noCPair<T>(pair: CSPair<T>): pair is CSPairNotC<T> {
  return pair.client == null;
}

export function yesCPair<T>(pair: CSPair<T>): pair is CSPairYesC<T> {
  return pair.client != null;
}

export function noSPair<T>(pair: CSPair<T>): pair is CSPairNotS<T> {
  return pair.server == null;
}

export function yesSPair<T>(pair: CSPair<T>): pair is CSPairYesS<T> {
  return pair.server != null;
}
