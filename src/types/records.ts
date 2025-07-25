export const DnsTypeSOA = "SOA"; // 6
export const DnsTypeNS = "NS"; // 2
export const DnsTypeMX = "MX"; // 15
export const DnsTypeA = "A"; // 1
export const DnsTypeAAAA = "AAAA"; // 28
export const DnsTypeCNAME = "CNAME"; // 5
export const DnsTypeTXT = "TXT"; // 16
export const DnsTypeSRV = "SRV"; // 33
export const DnsTypeCAA = "CAA"; // 257

export type AnyValue = SoaValue | NsValue | MxValue | AValue | AaaaValue | CnameValue | TxtValue | SrvValue | CaaValue;
export type AnyRecord = ApiRecordFormat<AnyValue>;

export interface ApiRecordFormat<T> {
  id?: number;
  name: string;
  zone_id?: number;
  type: string;
  ttl: number | null;
  value: T;
}

export interface SoaValue {
  ns: string;
  mbox: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minttl: number;
}

export function isSoaRecord(x: AnyRecord): x is ApiRecordFormat<SoaValue> {
  return x.type === DnsTypeSOA;
}

export type NsValue = string;

export function isNsRecord(x: AnyRecord): x is ApiRecordFormat<NsValue> {
  return x.type === DnsTypeNS;
}

export interface MxValue {
  preference: number;
  mx: string;
}

export function isMxRecord(x: AnyRecord): x is ApiRecordFormat<MxValue> {
  return x.type === DnsTypeMX;
}

export type AValue = string;

export function isARecord(x: AnyRecord): x is ApiRecordFormat<AValue> {
  return x.type === DnsTypeA;
}

export type AaaaValue = string;

export function isAaaaRecord(x: AnyRecord): x is ApiRecordFormat<AaaaValue> {
  return x.type === DnsTypeAAAA;
}

export type CnameValue = string;

export function isCnameRecord(x: AnyRecord): x is ApiRecordFormat<CnameValue> {
  return x.type === DnsTypeCNAME;
}

export type TxtValue = string;

export function isTxtRecord(x: AnyRecord): x is ApiRecordFormat<TxtValue> {
  return x.type === DnsTypeTXT;
}

export interface SrvValue {
  priority: number;
  weight: number;
  port: number;
  target: string;
}

export function isSrvRecord(x: AnyRecord): x is ApiRecordFormat<SrvValue> {
  return x.type === DnsTypeSRV;
}

export interface CaaValue {
  flag: number;
  tag: string;
  value: string;
}

export function isCaaRecord(x: AnyRecord): x is ApiRecordFormat<CaaValue> {
  return x.type === DnsTypeCAA;
}
