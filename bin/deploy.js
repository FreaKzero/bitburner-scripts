import { deepscan } from "../lib/scan";
import { state } from "../lib/utils";
import cfg from "../etc/sys";
import { HOSTS } from '../var/cache.js';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const script = ns.args[0] || "dist/auto.js";
  const host = ns.args[1] || null;
  const home = ns.args[2] || null;

  const servers = deepscan(ns);

  if (
    host &&
    ["auto.js", "hack.js", "weak.js", "grow.js"].some((s) => script.includes(s))
  ) {
    state(ns, "attack", host);
  } else {
    state(ns, "attack", "");
  }

  for (const serv of servers) {
    if (serv !== "home") {
      ns.killall(serv);
      ns.scp(cfg.dist, serv);
 
      const aRam = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv);
      const sRam = ns.getScriptRam(script);
      const threads = Math.floor(aRam / sRam);
      const rattack = host || serv;
      ns.exec(script, serv, threads || 1, rattack);
    }
  }

  if (home) {
    const aRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
    const sRam = ns.getScriptRam(script);
    const threads = Math.floor(aRam / sRam);
    const rattack = host || "home";
    ns.exec(script, "home", threads || 1, rattack);
  }
}

export function autocomplete(data, args) {
  if (args.length === 0) {
    return cfg.dist;
  } else if (args.length === 2) {
    return HOSTS;
  }

  return [...cfg.dist, ...HOSTS];
}
