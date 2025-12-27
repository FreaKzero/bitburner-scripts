import {C, DARKWEB_PROGRAMS, SPECIAL_HOSTS} from '../lib/const';
import { pad } from '../lib/utils';
import {execTerm} from '../lib/ui';

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.ui.resizeTail(450, 200);
  ns.disableLog('ALL');

  const openPorts = DARKWEB_PROGRAMS.map(a => a.program).reduce((acc, cur) => {
    acc += ns.fileExists(cur) ? 1 : 0;
    return acc;
  }, 0);

   let O = ``;
    ns.clearLog();
    for (const h of SPECIAL_HOSTS) {
      const s = ns.getServer(h.host);
      const skill = ns.getPlayer().skills.hacking;
      const left = h.lvl - skill;

      if (!s.backdoorInstalled && (skill >= h.lvl && h.ports <= openPorts)) {
        ns.print(`\t   Please Wait ...`);
        ns.print(`\t   🖥️ Hacking ${h.host}\n\n\n\n`);
        ns.exec('bin/conn.js', 'home', 1, h.host, 'true');
        await ns.sleep(50000);
        execTerm('home'); 
      }
      ns.clearLog();
      O += `${s.backdoorInstalled ? C.green : C.red}${s.backdoorInstalled ? "✔️" : "❌"}  ${pad(left > 0 ? left : 0, 3, '', false)}  ${h.host} ${C.reset}\n`;
    }

    ns.print(O);
}
