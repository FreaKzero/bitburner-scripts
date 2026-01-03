import { C, fromFormat, getArgs, initState, line } from "../lib/utils";
import cfg from "../etc/names";
import {execTerm} from '../lib/ui';

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const startMoney = ns.getPlayer().money;
  const ln = `${line(51, "black")}${C.reset}\n`;

  let {autodeploy, budget } = getArgs(ns, {
    budget: undefined,
    autodeploy: false
  });

  budget = budget ? fromFormat(budget) : startMoney;

  const SERVER_NEW_RAM = 8;
  const numServer = ns.getPurchasedServers().length;
  const maxServer = ns.getPurchasedServerLimit();

  const getServerCollection = () => {
    return ns.getPurchasedServers().map((host) => {
      return {
        name: host,
        ram: ns.getServerMaxRam(host),
      };
    });
  };

  const calcUpgrade = (server, budget) => {
    for (
      var i = server.ram * 2;
      i <= ns.getPurchasedServerMaxRam(server.name);
      i *= 2
    ) {
      if (ns.getPurchasedServerUpgradeCost(server.name, i) > budget) {
        break;
      }
    }
    return i / 2;
  };

  const getBudget = () => {
    const money = ns.getPlayer().money;
    return money + budget - startMoney;
  };

  ns.ui.openTail();
  ns.ui.setTailTitle(" 🗄️ Server Daemon");

  const [state] = initState(ns);

  while (true) {
    const AllServers = getServerCollection();
    const servers = AllServers.filter(
      (a) => a.ram < ns.getPurchasedServerMaxRam(a.name)
    );
    const B = ns.formatNumber(getBudget());
    let O = ln;

    if (!servers.length) {
      if (ns.getPurchasedServerCost(SERVER_NEW_RAM) < getBudget()) {
        ns.purchaseServer(
          `${cfg.prefixServer}${AllServers.length}`,
          SERVER_NEW_RAM
        );
        if (autodeploy) {
          execTerm(`deploy dist/auto.js ${state("attack")} `);
        }
      }
    }

    for (const server of servers) {
      const purRam = calcUpgrade(server, getBudget());
      ns.upgradePurchasedServer(server.name, purRam);
    }

    for (const server of AllServers) {
      const MAXRAM = ns.getPurchasedServerMaxRam("");
      const col = server.ram < MAXRAM ? C.yellow : C.green;
      const icon = server.ram < MAXRAM ? "🛠️" : "🗄️";
      O += `${col} ${icon} ${server.name}\tRAM: ${ns.formatRam(server.ram)}${
        C.reset
      }\n`;
    }
    ns.clearLog();
    O += ln;
    O += ` 💰 CURRENT BUDGET: $${B}\n`;
    O += ln;
    ns.print(O);

    if (numServer >= maxServer) {
      ns.print(`Maximum of Purchaseable Servers reached`);
      ns.exit();
    }
    await ns.sleep(1500);
  }
}

export function autocomplete(data,args) {
  const params = ['budget=', 'autodeploy=true'] 
  return [...params];
}