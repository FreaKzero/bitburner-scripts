import { DARKWEB_PROGRAMS } from "../lib/const";
import { C, fromFormat, setupTail } from "../lib/utils";
import { goLocation, goSidebar, findElement, execTerm } from "../lib/ui";
/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  setupTail(ns, {
    title: "💥 Autocrack Daemon",
    w: 450,
    h: 200,
    x: 1147,
    y: 234,
  });

  while (true) {
    const doc = eval("document");
    ns.clearLog();
    const inTerminal = doc.getElementById("terminal-input") ? true : false;

    if (!inTerminal) {
      ns.print(`${C.yellow}   🚨 Not in Terminal, Process disabled 🚨\n\n\n\n`);
      break;
    }

    const list = DARKWEB_PROGRAMS.filter((a) => !ns.fileExists(a.program));

    if (list.length < 1) {
      ns.print(
        `${C.yellow}    🔥 All cracks bought, used, deployed 🔥\n\n\n\n`
      );
      ns.exit();
    }

    if (!ns.hasTorRouter() && ns.getPlayer().money > fromFormat("200.000k")) {
      goLocation("T");
      findElement(".MuiButtonBase-root", "TOR router", true);
      goSidebar("Terminal");
      ns.print(`${C.yellow} Buying TOR Router`);
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
        ns.print(`${C.red} 💣 Deploy and Attack foodnstuff`);
        execTerm(`deploy dist/auto.js foodnstuff`);
      }

      await ns.sleep(3 * 10000);
    }

    ns.clearLog();
    ns.print(`${C.magenta}           ⏳ Waiting for Money ⏳\n\n\n\n`);
    await ns.sleep(20 * 10000);
  }
}
