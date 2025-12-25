import { getStockCollection, getStockUpdateTime } from "../lib/stonks";
import { getArgs } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const { wat } = getArgs(ns, {
    wat: false,
  });

  ns.ui.openTail();
  while (true) {
    const x = getStockCollection(ns, 0.0015);
    if (x.length) {
      for (const a of x) {
        ns.print(`${a.sym}\t\t${a.potential.toFixed(4)}\t\t${a.price.toFixed(2)}`);
      }
    }
    await ns.sleep(getStockUpdateTime(ns));
  }
  
  //ns.tprintRaw(JSON.stringify(x, null, 2))
}

/* 
ns) {
    const { ignore, log, autobuy, pot, sellout } = getArgs(ns, {
        autobuy: true,
        pot: 15, // 0.0015
        log: false,
        ignore: '',
    });
    const POT = pot / 10000; */
