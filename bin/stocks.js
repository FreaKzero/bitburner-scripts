import { getStockCollection } from "../lib/stocks";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.ui.resizeTail(680, 200);

  const pot = 15;

  const POT = pot / 10000;

  /* const getBudget = () => {
    const money = ns.getPlayer().money;
    return money + budget - startMoney;
  }; */

  while (true) {
    ns.clearLog();
    const list = getStockCollection(ns, POT);
    if (list.length) {
      list.forEach(a => {
          ns.tprint(`${a.sym}\t${a.chance}\t${a.forecast}`)
      });
    }
    await ns.stock.nextUpdate();
  }
}
