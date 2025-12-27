import { C, fromFormat, getArgs } from "../lib/utils";
import cfg from '../etc/names';


/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const startMoney = ns.getPlayer().money;

  let { budget } = getArgs(ns, {
    budget: undefined,
  });

  budget = budget ? fromFormat(budget) : startMoney;

  const SERVER_NEW_RAM = 8;
  const MAXRAM = ns.getPurchasedServerMaxRam();
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
    for (var i = server.ram * 2; i <= MAXRAM; i *= 2) {
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
  ns.ui.setTailTitle("Server Upgrade Agent");

  while (true) {
    const AllServers = getServerCollection();
    const servers = AllServers.filter((a) => a.ram < MAXRAM);

    let O = `CURRENT BUDGET: $${ns.formatNumber(getBudget())}\n`;
 
    if (!servers.length) {
      if (ns.getPurchasedServerCost(SERVER_NEW_RAM) < getBudget()) {
        ns.purchaseServer(
          `${cfg.prefixServer}${AllServers.length}`,
          SERVER_NEW_RAM
        );
      }
    }

    for (const server of servers) {
      const purRam = calcUpgrade(server, getBudget());
      if (server.ram >= purRam) {
        ns.exit();
      }
      ns.upgradePurchasedServer(server.name, purRam);
    }

    for (const server of AllServers) {
      const col = server.ram < MAXRAM ? C.yellow : C.green;
      const icon = server.ram < MAXRAM ? "💸" : "✔️";
      O += `${col}${icon}\t${server.name}\tRAM:${ns.formatRam(server.ram)}${
        C.reset
      }\n`;
    }
    ns.clearLog();
    ns.print(O);

     if (numServer >= maxServer) {
      ns.print(`Maximum of Purchaseable Servers reached`);
      ns.exit();
    }


    await ns.sleep(1500);
  }
}
