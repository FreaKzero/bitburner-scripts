import { DARKWEB_PROGRAMS } from "../lib/const";
import {C, pad} from '../lib/utils';
import { execTerm } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL');

    ns.ui.openTail();
        ns.ui.resizeTail(450, 180);

    ns.clearLog();
    
  let O = "";
  if (!ns.hasTorRouter() && ns.getPlayer().money > 200000) {
    ns.exec("./tor.js", "home");
    await ns.sleep(500);
  }

  if (ns.hasTorRouter) {
     O += ` ✔️ ${C.green} TOR Router \t200.000k${C.reset}\n`;
  } else {
     O += ` ❌ ${C.red} TOR Router\t200.000k${C.reset}\n`;
  }

  for (const prog of DARKWEB_PROGRAMS) {
    const money = ns.getPlayer().money;
    const price = pad(ns.formatNumber(prog.price),8, '$', false);
    if (!ns.fileExists(prog.program)) {
      if (prog.price < money) {
        O += `     ✔️ ${C.yellow} ${prog.program}\t${price}${C.reset}\n`;
        execTerm(`buy ${prog.program}`);
      } else {
        O += `     ❌ ${C.red} ${prog.program}\t${price}${C.reset}\n`;
      }
    } else {
      O += `     ✔️ ${C.green} ${prog.program}\t${price}${C.reset}\n`;
    }
    await ns.sleep(300);
  }
  ns.print(O);
}
