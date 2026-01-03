import { DARKWEB_PROGRAMS } from "../lib/const";
import { C, pad, setupTail } from "../lib/utils";
import { execTerm, goSidebar, inView } from "../lib/ui";
import { SPECIAL_HOSTS } from "../var/cache.js";
/** @param {import("..").NS } ns */
export async function main(ns) {
  setupTail(ns, {
    title: "🚪 Backdoor Daemon",
    w: 450,
    h: 200,
    x: 1145,
    y: 15,
  });
  ns.disableLog("ALL");

  let hacked = 0;

  const openPorts = DARKWEB_PROGRAMS.map((a) => a.program).reduce(
    (acc, cur) => {
      acc += ns.fileExists(cur) ? 1 : 0;
      return acc;
    },
    0
  );

  while (true) {
    let O = ``;
    if (!inView("terminal")) {
      goSidebar("terminal");
    }

    ns.clearLog();
    for (const h of SPECIAL_HOSTS) {
      let s = ns.getServer(h.host);
      const skill = ns.getPlayer().skills.hacking;
      const left = h.lvl - skill;

      if (!s.backdoorInstalled && skill >= h.lvl && h.ports <= openPorts) {
        ns.print(`\t   Please Wait ...`);
        ns.print(`\t   🖥️ Backdooring  ${h.host}\n\n\n\n`);
        ns.exec("bin/conn.js", "home", 1, h.host, "true");
        await ns.sleep(30000);
        hacked++;
        execTerm("home");
      }

      if (s.backdoorInstalled) {
        hacked++;
      }

      s = ns.getServer(h.host);
      ns.clearLog();
      O += `${s.backdoorInstalled ? C.green : C.red}${
        s.backdoorInstalled ? " ✔️" : " ❌"
      }  ${pad(left > 0 ? left : 0, 3, "", false)}  ${h.host} ${C.reset}\n`;
    }

    if (hacked >= SPECIAL_HOSTS.length && openPorts >= 5) {
      O = `${C.magenta}   🕶️ All Faction Hosts are Backdoored 🕶️\n\n\n\n`;
    }

    ns.print(O);
    await ns.sleep(20 * 10000);
  }
}
