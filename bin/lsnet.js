import { state, getArgs, pad, C, replaceAll } from "../lib/utils";
import { deepscan } from "../lib/scan";
import { SPECIAL_HOSTS, STOCK_HOST_COLLECTION } from "../lib/const";
import cfg from '../etc/names.js';

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')
  ns.ui.openTail();
  ns.ui.resizeTail(850, 800);

  const { own, sort, ducks, dir } = getArgs(ns, {
    sort: false,
    ducks: true,
    dir: "asc",
    own: false,
  }, () => {
    ns.tprintRaw('Sort Options: level | money')
  });

  const render = () => {
    const attacked = state(ns, "attack");
    let output = "\n";
    let list = deepscan(ns);
    if (!own) {
      list = list.filter((a) => !a.includes(cfg.prefixServer));
    }
  
    list = list.map((item) => {
    const times = [ns.getHackTime(item), ns.getGrowTime(item), ns.getWeakenTime(item)]
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    
    const hacktime = replaceAll(ns.tFormat(avg), {
        ' seconds': 's',
        ' second': 's',
        ' minutes': 'm',
        ' minute': 'm',
        ' hours': 'h',
        ' hour': 'h',
    });

      const serv = ns.getServer(item);
      
      const run =
        serv.ramUsed > 0
          ? "🖥️"
          : serv.maxRam < 1
          ? item === attacked
            ? "💥"
            : "🦆"
          : "  ";
      const lvl = serv.requiredHackingSkill;

      const bd = serv.backdoorInstalled
        ? "🚪"
        : serv.hasAdminRights
        ? "🔑"
        : `🔒(${serv.numOpenPortsRequired})`;

      let col = SPECIAL_HOSTS.find((e) => e.host === item)
        ? C.magenta
        : serv.backdoorInstalled
        ? C.yellow
        : attacked === item
        ? C.red
        : serv.hasAdminRights
        ? C.white
        : C.black;

      const stock = STOCK_HOST_COLLECTION.find((e) => e.host === item) || {
        sym: "    ",
      };

      return {
        host: item,
        money: serv.moneyAvailable,
        moneyMax: serv.moneyMax,
        exec: run,
        hacklvl: lvl,
        indicator: bd,
        col: col,
        symbol: stock.sym,
        hacktime: hacktime
      };
    });

    if (!ducks) {
      list = list.filter((a) => a.exec !== "🦆");
    }

    if (sort === "level") {
      list = list.sort((a, b) =>
        dir.toLowerCase() === "asc"
          ? a.hacklvl - b.hacklvl
          : b.hacklvl - a.hacklvl
      );
    }

    if (sort === "money") {
      list = list.sort((a, b) =>
        dir.toLowerCase() === "asc" ? a.money - b.money : b.money - a.money
      );
    }

    list.forEach((a) => {
      const money = ns.formatNumber(a.money);
      const moneyMax = ns.formatNumber(a.moneyMax);

      output += `${a.col}  ${a.exec} ${pad(a.indicator, 6)} ${pad(
        a.hacklvl,
        6
      )}${pad(a.symbol, 6)}${pad(a.host, 18)}${pad(
        money,
        15,
        "$",
        false
      )} ${pad(moneyMax, 10, "$", false)}   ${pad(a.hacktime, 10, "", false)} ${C.reset}\n`;
    });

    ns.print(output);
  };

  while (true) {
    ns.clearLog();
    render();
    await ns.sleep(5000);
  }
}
