import { state, getArgs, pad } from "../lib/utils";
import { deepscan } from "../lib/scan";
import { C, SPECIAL_HOSTS, STOCK_HOST_COLLECTION } from "../lib/const";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.ui.resizeTail(800, 800);
  ns.atExit(() => {
    ns.ui.closeTail();
  });

  const attacked = state(ns, "attack");

  const { sort, ducks, dir, h } = getArgs(ns, {
    sort: false,
    ducks: true,
    dir: "asc",
    h: null,
  });

  const render = () => {
    let output = "\n";

    const list = deepscan(ns).map((item) => {
      const serv = ns.getServer(item);
      const run = serv.ramUsed > 0 ? "🖥️" : serv.maxRam < 1 ? item === attacked ? "💥" : "🦆" : "  ";
      const lvl = serv.requiredHackingSkill;

      const bd = serv.backdoorInstalled
        ? "🚪"
        : serv.hasAdminRights
        ? "🔑"
        : `🔒(${serv.numOpenPortsRequired})`;

      let col = SPECIAL_HOSTS.find((e) => e === item)
        ? C.magenta
        : serv.backdoorInstalled
        ? C.yellow
        : attacked === item
        ? C.red
        : serv.hasAdminRights
        ? C.white
        : C.black;

      if (h && h === item) {
        col = C.brightGreen;
      }

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
      };
    });

    let view = list;

    if (!ducks) {
      view = view.filter((a) => a.exec !== "🦆");
    }

    if (sort === "level") {
      view = view.sort((a, b) =>
        dir.toLowerCase() === "asc"
          ? a.hacklvl - b.hacklvl
          : b.hacklvl - a.hacklvl
      );
    }

    if (sort === "money") {
      view = view.sort((a, b) =>
        dir.toLowerCase() === "asc" ? a.money - b.money : b.money - a.money
      );
    }

    view.forEach((a) => {
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
      )} ${pad(moneyMax, 10, "$", false)} ${C.reset}\n`;
    });

    ns.print(output);
  };

  while (true) {
    ns.clearLog();
    render();
    await ns.sleep(5000);
  }
}
