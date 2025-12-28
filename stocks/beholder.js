import { findElement, goCity, goLocation, goSidebar } from "./lib/ui";
import { fromFormat, replaceAll } from "./lib/utils";
import cfg from "./etc/stocks";

/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.ui.openTail();

  const debug = false;

  const FORECAST_SCORE = {
    "---": 0.1,
    "--": 0.25,
    "-": 0.4,
    "+": 0.6,
    "++": 0.75,
    "+++": 0.9,
  };

  const MAX_VOLATILITY = 5;

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

  goSidebar("stock market");
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

    const [longShares, longPrice] = ns.stock.getPosition(match[2]);

    return {
      e: element,
      haveStocks: longShares > 0,
      longShares: longShares,
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

  function readAll() {
    const doc = eval("document");
    return [...doc.querySelectorAll(".MuiPaper-root span > p")]
      .map((n) => parseLine(n.innerText, n))
      .filter(Boolean);
  }

  ns.atExit(() => {
    readAll()
      .filter((a) => a.haveStocks)
      .forEach((a) => ns.stock.sellStock(a.sym, a.longShares));
  });

  while (true) {
    ns.clearLog();
    const stocks = readAll().sort((a, b) => b.score - a.score);
    if (debug) {
      console.clear();
      console.table(stocks);
    }

    for (var stock of stocks) {
      if (!stock.haveStocks && stock.score > 0.91 && stock.ableShares >= 1000) {
        ns.stock.buyStock(stock.sym, stock.ableShares);
        stock.e.click();
      }

      if (stock.haveStocks && stock.score < 0.85) {
        ns.stock.sellStock(stock.sym, stock.longShares);
        stock.e.click();
      }
    }
    const ui = stocks
      .filter((a) => a.haveStocks)
      .map((a) => {
        return `${a.sym}\t${a.score}\t${a.longShares}`;
      });

    ns.print(ui.join("\n"));

    await ns.stock.nextUpdate();
  }
}
