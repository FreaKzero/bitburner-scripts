import { getStockCollection } from "../lib/stonks";
import { fromFormat, line, C, pad, getArgs } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const { buy, pot, budget, ignore } = getArgs(ns, {
    buy: true,
    pot: 0.15,
    budget: ns.getPlayer().money,
    ignore: null
  });

  ns.atExit(() => {
    ns.ui.closeTail();
  });

  const startMoney = ns.getPlayer().money;
  const BUDGET = fromFormat(budget);
  let IGNORESTOCKS = [];

  if (ignore) {
    IGNORESTOCKS = ignore.split(',').map(a => a.trim());  
  }

  ns.ui.openTail();
  ns.ui.resizeTail(660, 300);

  const POT = pot / 100;
  const ln = `${line(67, C.white)}${C.reset}\n`;

  const getBudget = () => {
    const money = ns.getPlayer().money;
    return money + BUDGET - startMoney;
  };

  while (true) {
    ns.clearLog();
    let O = `${C.yellow}Current Budget: $${ns.formatNumber(getBudget())} \n`;
    O += ln;
    O += `${C.white}   SYM\t\t  POT\t    BOUGHT\t   CURRENT\t   PROFIT\t`;
    O += ln;

    const list = getStockCollection(ns, POT);

    if (list.length) {
      list.forEach((s) => {
        const fpot = pad(ns.formatPercent(s.potential));
        const fbought = pad(ns.formatNumber(s.longPrice), 8, "$", false);
        const fcur = pad(ns.formatNumber(s.price), 8, "$", false);
        const fprofit = pad(ns.formatNumber(s.profit), 8, "$", false);
        const haveMoney = getBudget() > s.ablePrice;
        const col = s.profit < 0 ? C.red : s.haveStocks ? C.green : C.white;
        const ignored = IGNORESTOCKS.includes(s.sym);
        const x = s.haveStocks ? '💸' : ignored ? '🚫' : '⌛';
        
        if (buy && !s.haveStocks && haveMoney && s.ableShares > 1000 && !ignored) {
          ns.exec("stocks/handler.js", "home", 1, s.sym, s.ableShares);
        }

        O += `${col}${x} ${s.sym}\t\t${fpot}\t${fbought}\t${fcur}\t${fprofit}${C.reset}\t\n`;
      });
      O += ln;
      ns.print(O);
    } else {
      ns.print(`${C.magenta}\t\t   👁️ Waiting for potential Stocks\n\n\n\n`);
    }

    await ns.stock.nextUpdate();
  }
}
