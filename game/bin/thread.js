import { getThreads } from "../lib/utils";
import cfg from "../etc/sys";
import { HOSTS } from '../var/cache.js';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const script = ns.args[0] || null;
  const args = ns.args[1] || "";
  const div = ns.args[2] || 90
  
  const allThreads = getThreads(ns, "home", script);
  const threads = Math.floor(allThreads * (div / 100));
  const uThreads = div === 100 ? Math.floor(allThreads) : threads || 1;
  ns.tprint(`Using ${threads} of ${allThreads} for ${script}`);
  ns.exec(script, "home", uThreads, args);
  ns.ui.openTail(script);
}
  
export function autocomplete(data, args) {
  const x = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  if (args.length === 0) {
    return cfg.dist;
  } else if (args.length === 2) {
    return HOSTS;
  } else if (args.length === 3) {
    return x;
  }

  return [...cfg.dist, ...HOSTS, ...x];
}
