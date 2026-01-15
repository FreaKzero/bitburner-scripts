import { DARKWEB_PROGRAMS } from "../lib/const";
import { C, pad, setupTail } from "../lib/utils";
import { execTerm, exitFocus, findElement, goSidebar, inView } from "../lib/ui";
import { SPECIAL_HOSTS } from "../var/cache.js";
/** @param {import("..").NS } ns */
export async function main(ns) {
  setupTail(ns, {
    title: "🚪 Backdoor Daemon",
    w: 500,
    h: 200,
    x: 1640,
    y: 155,
  });
  ns.disableLog("ALL");
  const openPorts = DARKWEB_PROGRAMS.map((a) => a.program).reduce(
    (acc, cur) => {
      acc += ns.fileExists(cur) ? 1 : 0;
      return acc;
    },
    0
  );

  while (true) {
    let hacked = 0;
    const hadFocus = inView("focus");
    let O = ``;

    ns.clearLog();
    for (const h of SPECIAL_HOSTS) {
      let s = ns.getServer(h.host);
      const skill = ns.getPlayer().skills.hacking;
      const left = h.lvl - skill;

      if (!s.backdoorInstalled && skill >= h.lvl && h.ports <= openPorts) {
        if (hadFocus) {
          exitFocus();
        }

        if (!inView("terminal")) {
          goSidebar("terminal");
        }
        execTerm("home");
        ns.print(`\t   Please Wait ...`);
        ns.print(`\t   🖥️ Backdooring  ${h.host}\n\n\n\n`);
        ns.exec("bin/conn.js", "home", 1, h.host, "true");
      }
      await ns.sleep(h.wait);
      s = ns.getServer(h.host);
      ns.clearLog();
      O += `${s.backdoorInstalled ? C.green : C.red}${
        s.backdoorInstalled ? " ✔️" : " ❌"
      }  ${pad(left > 0 ? left : 0, 3, "", false)}  ${h.host} ${C.reset}\n`;

      if (s.backdoorInstalled) {
        hacked++;
      }
       
    }

    if (hacked >= SPECIAL_HOSTS.length && openPorts >= 5) {
      ns.print(`${C.yellow}        🔥 All Faction Hosts are Backdoored 🔥\n\n\n\n`);
      ns.exit();
    }

    ns.print(O);

    if (hadFocus) {
      findElement("button", "Focus", true);
    }

    await ns.asleep(120000);
  }
}
