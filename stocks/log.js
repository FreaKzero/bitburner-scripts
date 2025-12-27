import { C, pad, line } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.openTail();
  ns.ui.resizeTail(610, 450);
  const ln = `${line(62, C.white)}${C.reset}\n`

  ns.clearLog();
  const logs = JSON.parse(ns.read("data/stocks.json"));
  let O = ln;
  O += `${C.white} SYM\t   PROFITS\t    LOSSES\t      DIFF\t  W/L\n`;
  O += ln;

  const [sumloss, sumwin, sumdiff] = logs.reduce(
    (acc, cur) => {
      acc[0] += cur.losses;
      acc[1] += cur.profits;
      acc[2] += cur.profits - Math.abs(cur.losses);
      return acc;
    },
    [0, 0, 0]
  );

  logs.forEach((log) => {
    const diff = log.profits - Math.abs(log.losses);
    const hits = `${log.wins}/${log.fails}`;
    const col = diff < 0 ? C.red : C.green;

    const fprof = pad(ns.formatNumber(log.profits), 8, "$", false);
    const floss = pad(ns.formatNumber(log.losses), 8, "$", false);
    const fdiff = pad(ns.formatNumber(diff), 8, "$", false);
    const fhits = pad(hits, 5, "", false);

    O += `${col} ${log.sym}\t${fprof}\t${floss}\t${fdiff}\t${fhits} ${C.reset}\n`;
  });
  O += ln;
  O += ` SUM\t   ${C.green}${pad(ns.formatNumber(sumwin), 8, "$")}${
    C.reset
  }\t ${C.red}${pad(ns.formatNumber(sumloss), 8, "$")}${C.reset}\t   ${
    C.white
  }${pad(ns.formatNumber(sumdiff), 8, "$")}`;
  O += ln;
  ns.print(O);
}
