import {IPv4, IPv6} from "ipaddr.js";

export type PrefixV4 = [IPv4, number];
export type PrefixV6 = [IPv6, number];

export function parseArpaToPrefix(title: string): PrefixV4 | PrefixV6 | null {
  if (title.endsWith(".in-addr.arpa")) {
    title = title.substring(0, title.length - ".in-addr.arpa".length);
    let segments = title.split(".");
    if (segments.length < 1 || segments.length > 4) return null;

    // 1->8, 2->16, 3->24, 4->32
    let bits = segments.length * 8;

    // Process custom prefixes
    let lastOctet = segments[0].split("_");
    switch (lastOctet.length) {
      case 1:
        break;
      case 2:
        // Remove the prefix from the segment
        segments[0] = lastOctet[0];
        bits = parseInt(lastOctet[1]);
        break;
      default:
        return null;
    }
    segments = segments.reverse();
    while (segments.length < 4) {
      segments.push("0");
    }

    // Try to parse the formed CIDR prefix
    return IPv4.parseCIDR(segments.join(".") + "/" + bits);
  }
  if (title.endsWith(".ip6.arpa")) {
    title = title.substring(0, title.length - ".ip6.arpa".length);
    let segments = title.split(".");
    if (segments.length < 1 || segments.length > 32) return null;

    // 1->4, 2->8, 3->12, 4->16
    let bits = segments.length * 4;

    // Process custom prefixes
    let lastHex = segments[0].split("_");
    switch (lastHex.length) {
      case 1:
        break;
      case 2:
        // Remove the prefix from the segment
        segments[0] = lastHex[0];
        bits = parseInt(lastHex[1]);
        break;
      default:
        return null;
    }
    segments = segments.reverse();
    while (segments.length < 32) {
      segments.push("0");
    }

    // Ensure segments are 1 char long and can me mostly safely merged together into 16-bit parts
    if (segments.filter(x => x.length != 1).length > 0) return null;

    // Merge 4 hex chars into a 16-bit part
    // [2, 0, 0, 1] -> "2001"
    let hextets = [];
    for (let i = 0; i < segments.length; i += 4) {
      hextets.push(segments.slice(i, i + 4).join(""));
    }

    // Try to parse the formed CIDR prefix
    return IPv6.parseCIDR(hextets.join(":") + "/" + bits);
  }
  return null;
}
