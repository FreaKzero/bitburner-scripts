import { deepscan } from "./lib/scan";
import { DISTFILES } from "./lib/const";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const run = ns.args[0] || null;
  const pattack = ns.args[1] || '';

  const servers = deepscan(ns);

  for (const serv of servers) {
    if (serv !== "home") {
      ns.killall(serv);
      ns.scp(DISTFILES, serv);

      if (run) {
        const aRam = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv);
        const sRam = ns.getScriptRam(run);
        const threads = Math.floor(aRam / sRam);
        const attack = pattack.trim() === `` ? serv : pattack;
        const secLevel = ns.getServerRequiredHackingLevel(attack);

        if (ns.getPlayer().skills.hacking >= secLevel) {
          ns.exec(run, serv, threads || 1, attack);
        } else {
          ns.tprintRaw(`${pattack} requires Hacklevel of ${secLevel}`);
        }
      }
    }
  }
}
