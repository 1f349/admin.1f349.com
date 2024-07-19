export const DnsTypeSOA = 6;
export const DnsTypeNS = 2;
export const DnsTypeMX = 15;
export const DnsTypeA = 1;
export const DnsTypeAAAA = 28;
export const DnsTypeCNAME = 5;
export const DnsTypeTXT = 16;
export const DnsTypeSRV = 33;
export const DnsTypeCAA = 257;

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
  return x.Hdr.Rrtype === DnsTypeSOA;
}

export interface NsRecord extends UnknownRecord {
  Ns: string;
}

export function isNsRecord(x: UnknownRecord): x is NsRecord {
  return x.Hdr.Rrtype === DnsTypeNS;
}

export interface MxRecord extends UnknownRecord {
  Preference: number;
  Mx: string;
}

export function isMxRecord(x: UnknownRecord): x is MxRecord {
  return x.Hdr.Rrtype === DnsTypeMX;
}

export interface ARecord extends UnknownRecord {
  A: string;
}

export function isARecord(x: UnknownRecord): x is ARecord {
  return x.Hdr.Rrtype === DnsTypeA;
}

export interface AaaaRecord extends UnknownRecord {
  AAAA: string;
}

export function isAaaaRecord(x: UnknownRecord): x is AaaaRecord {
  return x.Hdr.Rrtype === DnsTypeAAAA;
}

export interface CnameRecord extends UnknownRecord {
  Target: string;
}

export function isCnameRecord(x: UnknownRecord): x is CnameRecord {
  return x.Hdr.Rrtype === DnsTypeCNAME;
}

export interface TxtRecord extends UnknownRecord {
  Txt: Array<string>;
}

export function isTxtRecord(x: UnknownRecord): x is TxtRecord {
  return x.Hdr.Rrtype === DnsTypeTXT;
}

export interface SrvRecord extends UnknownRecord {
  Priority: number;
  Weight: number;
  Port: number;
  Target: string;
}

export function isSrvRecord(x: UnknownRecord): x is SrvRecord {
  return x.Hdr.Rrtype === DnsTypeSRV;
}

export interface CaaRecord extends UnknownRecord {
  Flag: number;
  Tag: string;
  Value: string;
}

export function isCaaRecord(x: UnknownRecord): x is CaaRecord {
  return x.Hdr.Rrtype === DnsTypeCAA;
}
