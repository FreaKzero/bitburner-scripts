import { pad } from "./lib/utils";
import { deepscan } from "./lib/scan";
import { C, SPECIAL_HOSTS, STOCK_HOST_COLLECTION } from "./lib/const";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const watch = ns.args[0] || false;
  ns.ui.openTail('scanner.js');
  const render = () => {
    const l = deepscan(ns);
    let output = "\n";
    
    l.forEach((item) => {
      const serv = ns.getServer(item);
      const money = ns.formatNumber(serv.moneyAvailable);
      const lvl = serv.requiredHackingSkill;
      const bd = serv.backdoorInstalled ? '👑' : serv.hasAdminRights ? "🔑" : `🔒(${serv.numOpenPortsRequired})`;
      const col = SPECIAL_HOSTS.find(e => e === item) ? C.magenta : (serv.backdoorInstalled ? C.yellow : serv.hasAdminRights ? C.white : C.black)
      const stock = STOCK_HOST_COLLECTION.find(e => e.host === item) || {sym: "    "} 
      output += `${col}  ${pad(bd, 6)} ${pad(lvl, 6)}${pad(stock.sym, 6)}${pad(item, 18)}${pad(
        money,
        15,
        "$",
        false
      )} ${C.reset}\n`;
    });

   ns.print(output);
  };

  if (watch) {
    while(true) {
      ns.clearLog();
      render();
      await ns.sleep(5000);
    }
  } else {
    render();
  }
}
