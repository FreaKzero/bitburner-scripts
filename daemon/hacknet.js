import { C, fromFormat, getArgs, line, setupTail } from "../lib/utils";
import cfg from "../etc/names";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");

  setupTail(ns, {
    title: "🕸️ Hacknet Upgrade Daemon",
    w: 500,
    h: 200,
    x: 1153,
    y: 413,
  });

  const startMoney = ns.getPlayer().money;
  const ln = `${line(51, "black")}${C.reset}\n`;

  const MAX = {
    ram: 64,
    cores: 16,
    level: 200,
  };

  let { budget } = getArgs(ns, {
    budget: undefined,
  });

  budget = budget ? fromFormat(budget) : startMoney;

  const getHacknetCollection = () => {
    const collection = [];

    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
      const { ram, level, cores } = ns.hacknet.getNodeStats(i);
      collection.push({
        ram,
        fram: ns.formatRam(ram),
        level,
        cores,
        name: `${cfg.prefixHacknet}${i}`,
        id: i,
      });
    }
    return collection;
  };

  const calcBuy = (node, mode, budget) => {
    const CHECK = {
      ram: ns.hacknet.getRamUpgradeCost,
      cores: ns.hacknet.getCoreUpgradeCost,
      level: ns.hacknet.getLevelUpgradeCost,
    };

    const modemax = MAX[mode] - node[mode];

    for (var i = 0; i < modemax; i++) {
      if (CHECK[mode](node.id, i) > budget) {
        break;
      }
    }

    return modemax === i ? i : i - 1;
  };

  const getBudget = () => {
    const money = ns.getPlayer().money;
    return money + budget - startMoney;
  };

  while (true) {
    const B = ns.formatNumber(getBudget());
    ns.clearLog();
    const servers = getHacknetCollection();
    const nodes = servers.filter(
      (a) => a.level < 200 || a.ram < 64 || a.cores < 16
    );

    const nodePrice = ns.hacknet.getPurchaseNodeCost();
    let O = ln;
    O += `${C.white} NAME\t\t\tLEVEL\tRAM\tCORES\n`;
    O += ln;

    if (nodes.length < 1) {
      if (nodePrice < getBudget()) {
        ns.hacknet.purchaseNode();
      }
    }

    for (const node of nodes) {
      const l = calcBuy(node, "level", getBudget());

      if (node.level < 200 && getBudget() > 0) {
        ns.hacknet.upgradeLevel(node.id, l);
      }

      const r = calcBuy(node, "ram", getBudget());

      if (node.ram < 64 && getBudget() > 0) {
        ns.hacknet.upgradeRam(node.id, r);
      }

      const c = calcBuy(node, "cores", getBudget());

      if (node.cores < 16 && getBudget() > 0) {
        ns.hacknet.upgradeCore(node.id, c);
      }
    }

    for (const s of servers) {
      const col =
        s.cores === MAX.cores && s.ram === MAX.ram && s.level === MAX.level
          ? C.green
          : C.yellow;
      const icon =
        s.cores === MAX.cores && s.ram === MAX.ram && s.level === MAX.level
          ? "🗄️"
          : "🛠️";

      O += `${col} ${icon} ${s.name}\t ${s.level}\t${s.fram}\t   ${s.cores}\n`;
    }
    O += ln;
    O += `${C.yellow} 💰 CURRENT BUDGET: $${B}\n`;
    O += ln;

    ns.print(O);
    await ns.sleep(2500);
  }
}
