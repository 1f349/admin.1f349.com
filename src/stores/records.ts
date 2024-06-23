import {writable} from "svelte/store";

export interface RecordHeader {
  Name: string;
  Rrtype: number;
  Class: number;
  Ttl: number;
}

export interface UnknownRecord {
  Hdr: RecordHeader;
}

export interface SoaRecord extends UnknownRecord {
  Ns: string;
  Mbox: string;
  Serial: number;
  Refresh: number;
  Retry: number;
  Expire: number;
  Minttl: number;
}

export function isSoaRecord(x: UnknownRecord): x is SoaRecord {
  return x.Hdr.Rrtype === 6;
}

export const soaRecords = writable<Array<SoaRecord>>([]);

export interface NsRecord extends UnknownRecord {
  Ns: string;
}

export function isNsRecord(x: UnknownRecord): x is NsRecord {
  return x.Hdr.Rrtype === 2;
}

export const nsRecords = writable<Array<NsRecord>>([]);

export interface MxRecord extends UnknownRecord {
  Preference: number;
  Mx: string;
}

export function isMxRecord(x: UnknownRecord): x is MxRecord {
  return x.Hdr.Rrtype === 15;
}

export const mxRecords = writable<Array<MxRecord>>([]);

export interface ARecord extends UnknownRecord {
  A: string;
}

export function isARecord(x: UnknownRecord): x is ARecord {
  return x.Hdr.Rrtype === 1;
}

export const aRecords = writable<Array<ARecord>>([]);

export interface AaaaRecord extends UnknownRecord {
  AAAA: string;
}

export function isAaaaRecord(x: UnknownRecord): x is AaaaRecord {
  return x.Hdr.Rrtype === 28;
}

export const aaaaRecords = writable<Array<AaaaRecord>>([]);

export interface CnameRecord extends UnknownRecord {
  Target: string;
}

export function isCnameRecord(x: UnknownRecord): x is CnameRecord {
  return x.Hdr.Rrtype === 5;
}

export const cnameRecords = writable<Array<CnameRecord>>([]);

export interface TxtRecord extends UnknownRecord {
  Txt: Array<string>;
}

export function isTxtRecord(x: UnknownRecord): x is TxtRecord {
  return x.Hdr.Rrtype === 16;
}

export const txtRecords = writable<Array<TxtRecord>>([]);

export interface SrvRecord extends UnknownRecord {
  Priority: number;
  Weight: number;
  Port: number;
  Target: string;
}

export function isSrvRecord(x: UnknownRecord): x is SrvRecord {
  return x.Hdr.Rrtype === 33;
}

export const srvRecords = writable<Array<SrvRecord>>([]);

export interface CaaRecord extends UnknownRecord {
  Flag: number;
  Tag: string;
  Value: string;
}

export function isCaaRecord(x: UnknownRecord): x is CaaRecord {
  return x.Hdr.Rrtype === 257;
}

export const caaRecords = writable<Array<CaaRecord>>([]);
