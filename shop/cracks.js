import { DARKWEB_PROGRAMS, C } from "../lib/const";
import { execTerm } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL');

    ns.ui.openTail();
        ns.ui.resizeTail(450, 150);

    ns.clearLog();
    
  let O = "";
  if (!ns.hasTorRouter()) {
    ns.exec("./tor.js", "home");
    await ns.sleep(500);
  }

  for (const prog of DARKWEB_PROGRAMS) {
    const money = ns.getPlayer().money;
    if (!ns.fileExists(prog.program)) {
      if (prog.pice < money) {
        O += `${C.yellow} ${prog.program}\t\t ✔️${C.reset}\n`;
        execTerm(`buy ${prog.program}`);
      } else {
        O += `${C.red} ${prog.program}\t\t ❌${C.reset}\n`;
      }
    } else {
      O += `${C.green} ${prog.program}\t\t ✔️${C.reset}\n`;
    }
    await ns.sleep(300);
  }
  ns.print(O);
}
