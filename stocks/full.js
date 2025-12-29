import { getStockCollection } from "../lib/stonks";
import { fromFormat, line, C, pad, getArgs } from "../lib/utils";
import cfg from '../etc/stocks';

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const { buylog, buy, pot, budget, ignore } = getArgs(ns, {
    buy: true,
    pot: 0.15,
    budget: ns.getPlayer().money,
    ignore: null,
    buylog: true
  });

  ns.atExit(() => {
    ns.exec('stocks/exit.js', 'home');
    ns.ui.closeTail();
  });

  const startMoney = ns.getPlayer().money;
  const BUDGET = fromFormat(budget);
  const IGNORESTOCKS = ignore ? cfg.ignoreStocks.concat(ignore.split(',').map(a => a.trim())) : cfg.ignoreStocks;

  ns.ui.openTail();
  ns.ui.resizeTail(660, 300);

  const POT = pot / 100;
  const ln = `${line(67, "white")}${C.reset}\n`;

  const getBudget = () => {
    const money = ns.getPlayer().money;
    return money + BUDGET - startMoney;
  };

  while (true) {
    ns.clearLog();

    let O = ``;
    
    if (buy) {
      O += `${C.yellow}Current Budget: $${ns.formatNumber(getBudget())} \n`;
    } else {
      O += `${C.yellow}Watchmode (No Autobuy)\n`;
    }

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
        const ignored = IGNORESTOCKS.includes(s.sym);
        const col = s.profit < 0 ? C.red : s.haveStocks ? C.green : ignored ? C.black : C.white;
        const x = s.haveStocks ? '💸' : ignored ? '🚫' : '⌛';
        
        if (buy && !s.haveStocks && haveMoney && s.ableShares > cfg.minShares && !ignored) {
          ns.exec("stocks/broker.js", "home", 1, s.sym, s.ableShares, buylog ? '1' : undefined);
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
