import { getThreads } from "../lib/utils";
import cfg from "../etc/sys";
import { SERVERS } from "../lib/const";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const script = ns.args[0] || null;
  const args = ns.args[1] || "";
  const div = ns.args[2] || 100

  ns.ui.openTail(script);
  const allThreads = getThreads(ns, "home", script);
  const threads = Math.floor(allThreads * (div / 100));
  
  ns.tprint(`Using ${threads} of ${allThreads} for ${script}`);
  ns.exec(script, "home", div === 100 ? Math.floor(allThreads) : threads || 1, args);
}

export function autocomplete(data, args) {
  const x = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  if (args.length === 0) {
    return cfg.dist;
  } else if (args.length === 2) {
    return SERVERS;
  } else if (args.length === 3) {
    return x;
  }

  return [...cfg.dist, ...SERVERS, ...x];
}
