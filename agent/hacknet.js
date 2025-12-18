import { disableLogs } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const HACKNET_PREFIX = "hacknet-node-";
  disableLogs(ns, ["sleep"]);
  const getHacknetCollection = () => {
    const collection = [];

    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
      const { ram, level, cores } = ns.hacknet.getNodeStats(i);
      collection.push({
        ram,
        level,
        cores,
        name: `${HACKNET_PREFIX}${i}`,
        id: i,
      });
    }
    return collection.filter(
      (a) => a.level < 200 || a.ram < 64 || a.cores < 16
    );
  };

  const calcBuy = (node, mode, budget) => {
    const MAX = {
      ram: 64,
      cores: 16,
      level: 200,
    };
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
     return i - 1;

  };

  ns.ui.openTail("agent/hacknet.js");
  ns.ui.setTailTitle('Hacknet Upgrade Agent');

  const getBudget = () => {
    return ns.getPlayer().money;
  }
  while (true) {
    ns.clearLog();
    const nodes = getHacknetCollection();
    const nodePrice = ns.hacknet.getPurchaseNodeCost();

    let O = `CURRENT BUDGET: $${ns.formatNumber(
      getBudget()
    )}\n`;

    if (nodes.length < 1) {
      if (nodePrice < getBudget()) {
        ns.hacknet.purchaseNode();
      }
    }

    for (const node of nodes) {
      O += `\n${node.name} \n`;
      const l = calcBuy(node, "level", getBudget());
      O += `Levels:\t${node.level} \n`;
      if (node.level < 200 && getBudget() > 0) {
        ns.hacknet.upgradeLevel(node.id, l);
      }

      const r = calcBuy(node, "ram", getBudget());
      O += `RAM:\t${node.ram} \n`;

      if (node.ram < 64 && getBudget() > 0) {
        ns.hacknet.upgradeRam(node.id, r);
      }

      const c = calcBuy(node, "cores", getBudget());
      O += `CORES:\t${node.cores}\n`;
      if (node.cores < 16 && getBudget() > 0) {
        ns.hacknet.upgradeCore(node.id, c);
      }
    }
    ns.print(O);
    await ns.sleep(30000);
  }
}
