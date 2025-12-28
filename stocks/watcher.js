import { goSidebar } from "../lib/ui";
import { fromFormat, pad, line, C } from "../lib/utils";
import cfg from "../etc/stocks";


// TODO Arguments
// TODO Budget
// TODO Refactor
/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.ui.openTail();
  goSidebar("stock market");
  const debug = false;
  const ln = `${line(67, C.white)}${C.reset}\n`;

  const FORECAST_SCORE = {
    "---": 0.1,
    "--": 0.25,
    "-": 0.4,
    "+": 0.6,
    "++": 0.75,
    "+++": 0.9,
  };

  const ignore = null;
  const MAX_VOLATILITY = 5;
  const IGNORESTOCKS = ignore
    ? cfg.ignoreStocks.concat(ignore.split(",").map((a) => a.trim()))
    : cfg.ignoreStocks;

  function normalizeVolatility(vol) {
    return Math.min(vol / MAX_VOLATILITY, 1);
  }

  function calcWeightedScore(forecast, volatility) {
    const forecastScore = FORECAST_SCORE[forecast] ?? 0.5;
    const volNorm = normalizeVolatility(volatility);

    return forecastScore * (1 + volNorm);
  }

  const rgx =
    /^(.+?)\s{2,}([A-Z]+)\s+-\s+\$([\d.]+[kmb]?)\s+-\s+Volatility:\s+([\d.]+)%\s+-\s+Price Forecast:\s+([+-]+)$/;

  function parseLine(line, element) {
    const match = line.match(rgx);
    if (!match) return null;

    const price = fromFormat(match[3]);
    const buyableShares = Math.floor(
      ns.getPlayer().money / cfg.buyDivisor / price
    );
    const maxShares = ns.stock.getMaxShares(match[2]);
    const ableShares = buyableShares <= maxShares ? buyableShares : maxShares;
    const ablePrice = ableShares * price;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [longShares, longPrice] = ns.stock.getPosition(match[2]);

    return {
      e: element,
      haveStocks: longShares > 0,
      longShares: longShares,
      longPrice: longPrice,
      name: match[1].trim(),
      sym: match[2],
      price: fromFormat(match[3]),
      volatility: Number(match[4]),
      forecast: match[5],
      score: calcWeightedScore(match[5], Number(match[4])),
      buyableShares: buyableShares,
      ableShares: ableShares,
      ablePrice: ablePrice,
    };
  }

  function readAll(doc) {
    return [...doc.querySelectorAll(".MuiPaper-root span > p")]
      .map((n) => parseLine(n.innerText, n))
      .filter(Boolean);
  }

  ns.atExit(() => {
    readAll(eval("document"))
      .filter((a) => a.haveStocks)
      .forEach((a) => {
        ns.stock.sellStock(a.sym, a.longShares);
        a.e.click();
      });
  });

  let ui = ln;
  ui += `${C.white}   SYM\t\t  POT\t    BOUGHT\t   CURRENT\t   DIFF\t\n`;
  ui += ln;
  while (true) {
    const doc = eval("document");
    if (!doc.querySelector("h4").innerText.includes("World Stock Exchange")) {
      goSidebar("stock market");
    }

    ns.clearLog();
    const stocks = readAll(doc).sort((a, b) => b.score - a.score);
    if (debug) {
      console.clear();
      console.table(stocks);
    }
    for (var stock of stocks) {
      if (
        !stock.haveStocks &&
        stock.score > 0.91 &&
        stock.ableShares >= 1000 &&
        !IGNORESTOCKS.includes(stock.sym)
      ) {
        ns.stock.buyStock(stock.sym, stock.ableShares);
        stock.e.click();
        stock.e.scrollIntoView();
      }

      if (stock.haveStocks && stock.score < 0.85) {
        ns.stock.sellStock(stock.sym, stock.longShares);
        stock.e.click();
      }
    }
    ui += stocks
      .filter((a) => a.haveStocks)
      .map((a) => {
        const long = pad(ns.formatNumber(a.longPrice), 8, '$', false);
        const price = pad(ns.formatNumber(a.price), 8, '$', false);
        const diff = pad(ns.formatNumber(a.price - a.longPrice), 8, '$', false);
        const col = a.price - a.longPrice < 0 ? C.red : C.green;

        return `${col} 💸 ${a.sym}\t${a.score}\t${long}\t${price}\t${diff}${C.reset}`;
      }).join("\n");

    ns.print(ui);

    await ns.stock.nextUpdate();
  }
}
