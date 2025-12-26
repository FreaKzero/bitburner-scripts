/** @param {import("..").NS } ns */
export function getStockUpdateTime(ns) {
	const x = ns.stock.getConstants();
	return (x.msPerStockUpdate + x.msPerStockUpdateMin) / 2;
}

/** @param {import("..").NS } ns */
export function getStockInfo(ns, sym) {
    const tradefees = 100000 * 2;
    const [longShares, longPrice] = ns.stock.getPosition(sym);
    const forecast = parseFloat(ns.stock.getForecast(sym));
    const volatility = ns.stock.getVolatility(sym);
    const chance = Math.abs(forecast - 0.5);
    const potential = volatility * chance;
    const profit = longShares > 0 ? longShares * (ns.stock.getBidPrice(sym) - longPrice) - tradefees : 0;
    const profitPer = longShares > 0 ? ns.formatPercent(profit / (longPrice * longShares)) : '00.00%';
    const current = ns.stock.getAskPrice(sym);

    const buyableShares = Math.floor((ns.getPlayer().money / 1.1) / current);
    const maxShares = ns.stock.getMaxShares(sym);
    const ableShares = buyableShares <= maxShares ? buyableShares : maxShares;
    
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
        ableShares: ableShares
    };
}

/** @param {import("..").NS } ns */
export function getStockCollection(ns, argPotential) {
    const list = ns.stock.getSymbols();
    const x = list.map((sym) => getStockInfo(ns, sym));
    return x.filter((i) => i.haveStocks || (i.potential > argPotential && i.forecast > 0.53 && i.price >= 1000)).sort((a, b) => b.potential - a.potential);
}

// TODO Cheap Collection for startgames
/** @param {import("..").NS } ns */
export function getStockCollectionCheap() {}

