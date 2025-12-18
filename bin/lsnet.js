import { pad } from "../lib/utils";
import { deepscan } from "../lib/scan";
import { C, SPECIAL_HOSTS, STOCK_HOST_COLLECTION } from "../lib/const";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.openTail("bin/lsnet.js");
  const render = () => {
    const l = deepscan(ns);
    let output = "\n";

    l.forEach((item) => {
      const serv = ns.getServer(item);
      const money = ns.formatNumber(serv.moneyAvailable);
      const run = serv.ramUsed > 0 ? '🖥️' : ' ';
      const lvl = serv.requiredHackingSkill;
      const bd = serv.backdoorInstalled
        ? "👑"
        : serv.hasAdminRights
        ? "🔑"
        : `🔒(${serv.numOpenPortsRequired})`;
      const col = SPECIAL_HOSTS.find((e) => e === item)
        ? C.magenta
        : serv.backdoorInstalled
        ? C.yellow
        : serv.hasAdminRights
        ? C.white
        : C.black;
      const stock = STOCK_HOST_COLLECTION.find((e) => e.host === item) || {
        sym: "    ",
      };
      output += `${col}  ${pad(bd, 6)} ${pad(lvl, 6)}${pad(stock.sym, 6)}${pad(
        item,
        18
      )}${pad(money, 15, "$", false)} ${run} ${C.reset}\n`;
    });

    ns.print(output);
  };

  while (true) {
    ns.clearLog();
    render();
    await ns.sleep(5000);
  }
}
