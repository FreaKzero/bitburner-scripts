import {
  initState,
  getArgs,
  pad,
  C,
  replaceAll,
  setupTail,
} from "../lib/utils";
import { STOCK_HOST_COLLECTION } from "../lib/const";
import { SPECIAL_HOSTS } from "../var/cache.js";
import cfg from "../etc/names.js";
import { HOSTS } from "../var/cache.js";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  setupTail(ns, {
    title: `🌐 Network Monitor`,
    w: 850,
    h: 800,
    x: 70,
    y: 13,
  });

  const [state] = initState(ns);
  const { watch, sort, ducks, dir } = getArgs(
    ns,
    {
      sort: "level",
      ducks: true,
      dir: "asc",
      watch: false,
    },
    () => {
      ns.tprintRaw("Sort Options: level | money");
    }
  );

  const render = () => {
    const attacked = state("attack");
    let output = "\n";
    let list = HOSTS.filter((a) => !a.includes(cfg.prefixServer));
    list = list.map((item) => {
      const times = [
        ns.getHackTime(item),
        ns.getGrowTime(item),
        ns.getWeakenTime(item),
      ];
      const avg = times.reduce((a, b) => a + b, 0) / times.length;

      const hacktime = replaceAll(ns.tFormat(avg), {
        " seconds": "s",
        " second": "s",
        " minutes": "m",
        " minute": "m",
        " hours": "h",
        " hour": "h",
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

      let col = serv.backdoorInstalled
        ? C.yellow
        : SPECIAL_HOSTS.find((e) => e.host === item)
        ? C.magenta
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
        hacktime: hacktime,
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
      )} ${pad(moneyMax, 10, "$", false)}   ${pad(a.hacktime, 10, "", false)} ${
        C.reset
      }\n`;
    });

    ns.print(output);
  };

  if (watch) {
    while (true) {
      ns.clearLog();
      render();
      await ns.sleep(5000);
    }
  } else {
    ns.clearLog();
    render();
  }
}
