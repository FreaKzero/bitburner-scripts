import { getStockCollection } from "../lib/stonks";
import { fromFormat } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.ui.openTail();
  ns.ui.resizeTail(680, 200);
  const buy = true;
  const pot = 15;
  const POT = pot / 10000;
  const minMoney = fromFormat("300.000m");

  while (true) {
    ns.clearLog();
    const list = getStockCollection(ns, POT);

    if (list.length) {
      list.forEach((s) => {
        const haveMoney = ns.getPlayer().money > minMoney;

        if (buy && (!s.haveStocks && haveMoney && s.ableShares > 1000)) {
          ns.exec("stocks/handler.js", "home", 1, s.sym, s.ableShares);
        }
        
        ns.print(`${s.sym}\t${s.profit}\t${s.forecast}`);
      });
    } else {
      ns.print('Waiting for potential Stocks')
    }

    await ns.stock.nextUpdate();
  }
}
