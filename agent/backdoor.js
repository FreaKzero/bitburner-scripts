import {C} from '../lib/const';
import { pad } from '../lib/utils';

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.ui.resizeTail(450, 200);
  ns.disableLog('ALL');

  const list = [
    { host: "CSEC", lvl: 60, hacked: false },
    { host: "avmnite-02h", lvl: 220, hacked: false },
    { host: "run4theh111z", lvl: 538, hacked: false },
    { host: "I.I.I.I", lvl: 346, hacked: false },
    { host: "powerhouse-fitness", lvl: 1031, hacked: false },
    { host: "The-Cave", lvl: 925, hacked: false },
  ].sort((a, b) => a.lvl - b.lvl);

  while (true) {
    let O = ``;
    ns.clearLog();

    for (const h of list) {
      const skill = ns.getPlayer().skills.hacking;
      const left = h.lvl - skill;

      if (!h.hacked && skill >= h.lvl) {
        ns.print(`\t   Please Wait ...`);
        ns.print(`\t   🖥️ Hacking ${h.host}\n\n\n\n`);
        await ns.hack(h.host);
        h.hacked = true;
      }
      ns.clearLog();
      O += `${h.hacked ? C.green : C.red}${h.hacked ? "✔️" : "❌"}  ${pad(left > 0 ? left : 0, 3, '', false)}  ${h.host} ${C.reset}\n`;
    }

    ns.print(O);
    await ns.sleep(5 * 60000);
  }
}
