import { DARKWEB_PROGRAMS } from "../lib/const";
import { C, fromFormat, setupTail, initState } from "../lib/utils";
import {
  goLocation,
  goSidebar,
  findElement,
  execTerm,
  inView,
} from "../lib/ui";
/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  setupTail(ns, {
    title: "💥 Autocrack Daemon",
    w: 500,
    h: 200,
    x: 1640,
    y: 361,
  });

  while (true) {
    ns.clearLog();
    const [attack,] = initState(ns, "attack");
    if (!inView("terminal")) {
      goSidebar("terminal");
    }

    const list = DARKWEB_PROGRAMS.filter((a) => !ns.fileExists(a.program));

    if (!ns.hasTorRouter() && ns.getPlayer().money > fromFormat("200.000k")) {
      goLocation("T");
      findElement(".MuiButtonBase-root", "TOR router", true);
      goSidebar("Terminal");
      ns.print(`${C.yellow} 📡 Buying TOR Router`);
    }

    if (ns.hasTorRouter()) {
      for (const prog of list) {
        if (prog.price > ns.getPlayer().money) {
          break;
        }

        ns.print(`${C.yellow} 💸 Buying ${prog.program}`);
        execTerm(`buy ${prog.program}`);
        await ns.sleep(1500);
        execTerm(`cracknet`);
        ns.print(`${C.yellow} 👾 Executing cracknet`);
        await ns.sleep(1500);
        ns.print(`${C.red} 💣 Deploy and Attack ${attack}`);
        execTerm(`deploy dist/auto.js ${attack}`);
        
        // TODO Accept Faction Dialogs
      }

      await ns.sleep(3 * 10000);
    }

    if (list.length < 1) {
      ns.print(
        `${C.yellow}        🔥 All cracks bought, used, deployed 🔥\n\n\n\n`
      );
      ns.exit();
    }
    
    ns.clearLog();
    ns.print(`${C.magenta}               ⏳ Waiting for Money ⏳\n\n\n\n`);
    await ns.asleep(120000);
  }
}
