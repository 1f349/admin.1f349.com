export type CSPair<T> = {client: T; server: T; p: Promise<void>} | CSPairNotC<T> | CSPairNotS<T>;
export type CSPairNotC<T> = {client: null; server: T; p: Promise<void>};
export type CSPairNotS<T> = {client: T; server: null; p: Promise<void>};

export function noCPair<T>(pair: CSPair<T>): pair is CSPairNotC<T> {
  return pair.client == null;
}

export function noSPair<T>(pair: CSPair<T>): pair is CSPairNotS<T> {
  return pair.server == null;
}
