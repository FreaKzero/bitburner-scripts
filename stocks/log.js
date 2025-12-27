import {C, pad } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(610, 450);

  ns.clearLog();
  const logs = JSON.parse(ns.read("data/stocks.json"));
  ns.print(`${C.white}==============================================================`);
  ns.print(`${C.white}SYM\t   PROFITS\t    LOSSES\t      DIFF\t  W/L`);
  ns.print(`${C.white}==============================================================`);
  logs.forEach((log) => {
    const diff = log.profits - Math.abs(log.losses);
    const hits = `${log.wins}/${log.fails}`;
    const col = diff < 0 ? C.red : C.green;

    ns.print(
      `${col} ${log.sym}\t${pad(ns.formatNumber(log.profits), 8, "$", false)}\t${pad(
        ns.formatNumber(log.losses),
        8,
        "$", 
        false
      )}\t${pad(ns.formatNumber(diff), 8, "$", false)}\t${pad(hits, 5, '', false)} ${C.reset}`
    );
  });
  ns.print(`${C.white}==============================================================`);
}
