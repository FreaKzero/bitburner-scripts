import Store from "../lib/store";
import { getStockInfo } from "../lib/stonks";
import cfg from "../etc/stocks";
import { initState } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const sym = ns.args[0];
  const sharearg = ns.args[1];
  const pop = ns.args[2];

  const shares = parseInt(sharearg);

  let running = true;

  if (pop) {
    ns.ui.openTail();
    ns.ui.resizeTail(450, 150);
  }

  if (!sym || !shares || isNaN(shares)) {
    ns.print("you fucked up");
  }

  ns.stock.buyStock(sym, shares);

  ns.atExit(() => {
    const curStock = getStockInfo(ns, sym);
    const x = new Store(ns, "var/stocks.json");
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
    const st = getStockInfo(ns, sym);
    const [exit] = initState(ns, "StockExit");
  
    if (exit && st.profit > 0) {
      running = false;
    }

    if (st.forecast < cfg.forecastTreshold && st.potential < 0.14) {
      running = false;
    }

    await ns.stock.nextUpdate();
  }
}
