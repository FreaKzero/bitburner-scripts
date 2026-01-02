import cfg from '../etc/stocks';

/** @param {import("..").NS } ns */
export function getStockUpdateTime(ns) {
	const x = ns.stock.getConstants();
	return (x.msPerStockUpdate + x.msPerStockUpdateMin) / 2;
}

/** @param {import("..").NS } ns */
export function getStockInfo(ns, sym) {
    const [longShares, longPrice] = ns.stock.getPosition(sym);
    const forecast = parseFloat(ns.stock.getForecast(sym));
    const volatility = ns.stock.getVolatility(sym);
    const chance = Math.abs(forecast - cfg.chanceTreshold);
    const potential = volatility * chance;
    const profit = longShares > 0 ? longShares * (ns.stock.getBidPrice(sym) - longPrice) - cfg.tradeFees : 0;
    const profitPer = longShares > 0 ? ns.formatPercent(profit / (longPrice * longShares)) : '00.00%';
    const current = ns.stock.getAskPrice(sym);

    const buyableShares = Math.floor((ns.getPlayer().money / cfg.buyDivisor) / current);
    const maxShares = ns.stock.getMaxShares(sym);
    const ableShares = buyableShares <= maxShares ? buyableShares : maxShares;
    const ablePrice = ableShares * current;

    return {
        haveStocks: longShares > 0,
        sym: sym,
        forecast: forecast,
        longPrice: longPrice,
        longShares: longShares,
        volatility: volatility,
        chance: chance,
        potential: potential,
        profit: profit,
        profitPer: profitPer,
        price: current,
        ableShares: ableShares,
        ablePrice: ablePrice
    };
}

/** @param {import("..").NS } ns */
export function getStockCollection(ns, argPotential) {
    const list = ns.stock.getSymbols();
    const x = list.map((sym) => getStockInfo(ns, sym));
    return x.filter((i) => i.haveStocks || (i.potential > argPotential && i.forecast > cfg.forecastTreshold && i.price >= cfg.priceTreshold)).sort((a, b) => b.potential - a.potential);
}

// TODO Cheap Collection for startgames
/** @param {import("..").NS } ns */
export function getStockCollectionCheap() {}

