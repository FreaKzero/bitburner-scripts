import { getStockCollection } from "../lib/stonks";
import { fromFormat, line, C, pad, getArgs, setupTail } from "../lib/utils";
import cfg from "../etc/stocks";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const { buy, pot, budget, ignore } = getArgs(ns, {
    buy: true,
    pot: 0.15,
    budget: ns.getPlayer().money,
    ignore: null,
  });

  ns.atExit(() => {
    ns.exec("stocks/exit.js", "home");
    ns.ui.closeTail();
  });

  const startMoney = ns.getPlayer().money;
  const BUDGET = fromFormat(budget);
  const IGNORESTOCKS = ignore
    ? cfg.ignoreStocksFull.concat(ignore.split(",").map((a) => a.trim()))
    : cfg.ignoreStocksFull;

  setupTail(ns, {
    title: " 📈 Stonks Watcher (API)",
    w: 660,
    h: 300,
    x: 264,
    y: 50,
  });

  const POT = pot / 100;
  const ln = `${line(67, "black")}${C.reset}\n`;

  const getBudget = () => {
    const money = ns.getPlayer().money;
    return money + BUDGET - startMoney;
  };

  while (true) {
    ns.clearLog();

    let O = ``;

    O += ln;
    O += `${C.white}   SYM\t\t  POT\t    BOUGHT\t   CURRENT\t   PROFIT\t`;
    O += ln;

    const list = getStockCollection(ns, POT);

    if (list.length) {
      const allProfit = list.reduce((sum, item) => sum + item.profit, 0);

      list.forEach((s) => {
        const fpot = pad(ns.formatPercent(s.potential));
        const fbought = pad(ns.formatNumber(s.longPrice), 8, "$", false);
        const fcur = pad(ns.formatNumber(s.price), 8, "$", false);
        const fprofit = pad(ns.formatNumber(s.profit), 8, "$", false);
        const haveMoney = getBudget() > s.ablePrice;
        const ignored = IGNORESTOCKS.includes(s.sym);
        const col =
          s.profit < 0
            ? C.red
            : s.haveStocks
            ? C.green
            : ignored
            ? C.black
            : C.white;
        const x = s.haveStocks ? "💸" : ignored ? "🚫" : "⌛";

        if (
          buy &&
          !s.haveStocks &&
          haveMoney &&
          s.ableShares > cfg.minShares &&
          !ignored
        ) {
          ns.exec("stocks/broker.js", "home", 1, s.sym, s.ableShares);
        }

        O += `${col}${x} ${s.sym}\t\t${fpot}\t${fbought}\t${fcur}\t${fprofit}${C.reset}\t\n`;
      });
      O += ln;

      const p = pad(
        `${C.white}Portfolio Profit:${C.reset}${
          allProfit > 0 ? C.green : C.red
        } $${ns.formatNumber(allProfit)}`,
        30,
        "",
        false
      );

      if (buy) {
        O += `${C.white}Current Budget:${C.reset}${C.yellow} $${ns.formatNumber(
          getBudget()
        )}${C.reset} ${C.white}${C.reset}\t\t${p}\n`;
      } else {
        O += `${C.yellow}Watchmode (No Autobuy)\n`;
      }

      ns.print(O);
    } else {
      ns.print(`${C.magenta}\t\t  ⏳ Waiting for potential Stocks ⏳\n\n\n\n\n\n`);
    }

    await ns.stock.nextUpdate();
  }
}
