export interface Zone {
  id: number;
  name: string;
  serial: number;
  admin: string;
  refresh: number;
  retry: number;
  expire: number;
  ttl: number;
  active: boolean;
  nameservers: string[];
}
