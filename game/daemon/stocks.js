import { fromFormat, getArgs, initState } from "../lib/utils";
import cfg from "../etc/stocks";


/** @param {import("..").NS } ns */
export async function main(ns) {
  const host = "home";

  const { exit, budget, ignore } = getArgs(ns, {
    budget: null,
    ignore: null,
    exit: false
  });

  const BUDGET = budget ? fromFormat(budget) : ns.getPlayer().money;

  const IGFULL = ignore
    ? cfg.ignoreStocksFull.concat(ignore.split(",").map((a) => a.trim()))
    : cfg.ignoreStocksFull;

  const IGLIGHT = ignore
    ? cfg.ignoreStocksLight.concat(ignore.split(",").map((a) => a.trim()))
    : cfg.ignoreStocksLight;

  if (exit) {
     const [, setExit] = initState(ns, "StockExit");
      setExit(true);
      ns.print('Sending EXIT Signal to brokers');
  }

  if (!ns.stock.hasWSEAccount()) {
    ns.ui.openTail();
    
    // find out what costs what
    // render a button to buy
    ns.tprint("ERROR: Cant run stocks");
    return;
  }

  if (
    ns.stock.hasTIXAPIAccess() &&
    ns.stock.has4SDataTIXAPI() &&
    ns.stock.has4SData()
  ) {
    ns.exec(
      "../stocks/full.js",
      host,
      1,
      ...[`budget=${BUDGET}`, `ignore=${IGFULL}`],
    );
  } else if (ns.stock.hasTIXAPIAccess() && ns.stock.has4SDataTIXAPI()) {
    ns.exec(
      "../stocks/light.js",
      host,
      1,
      ...[`budget=${BUDGET}`, `ignore=${IGLIGHT}`],
    );
  } else {
    ns.tprint("ERROR: Cant run stocks");
  }
}
