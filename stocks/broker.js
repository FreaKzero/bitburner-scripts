import Store from "../lib/store";
import { getStockInfo } from "../lib/stonks";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const sym = ns.args[0];
  const sharearg = ns.args[1];

  const shares = parseInt(sharearg);

  let running = true;

  if (!sym || !shares || isNaN(shares)) {
    ns.alert("you fucked up");
  }

  ns.stock.buyStock(sym, shares);

  ns.atExit(() => {
    const curStock = getStockInfo(ns, sym);
    const x = new Store(ns, "data/stocks.json");
    x.setSchema({
      sym: sym,
      fails: 0,
      wins: 0,
      profits: 0,
      losses: 0,
    });

    x.findOne((a) => a.sym === sym)
      .upsert((a) => {
        if (curStock.profit < 0) {
          return {
            ...a,
            fails: a.fails + 1,
            losses: a.losses + curStock.profit,
          };
        } else {
          return {
            ...a,
            wins: a.wins + 1,
            profits: a.profits + curStock.profit,
          };
        }
      })
      .persist();

      ns.stock.sellStock(sym, curStock.longShares);
  });

  while (running) {
    if (ns.stock.getPosition(sym)[0] <= 0) {
      running = false;
    }

    if (ns.stock.getForecast(sym) < 0.52) {
      running = false;
    }

    await ns.stock.nextUpdate();
  }
}
