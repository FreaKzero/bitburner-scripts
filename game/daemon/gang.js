import cfg from "../etc/gang";
import {
  gangBuy,
  gangGetUIUpgrades,
  gangIsWanted,
  gangMemberAscend,
  gangRecruit,
  getMemberPower,
} from "../lib/gang";

import { setupTail, getArgs, pad, line, C } from "../lib/utils";
/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const ln = line(73, "white");

  const { buy, focus } = getArgs(ns, {
    buy: true,
    focus: "money",
  });

  const FOCUS = focus.toLowerCase();
  setupTail(ns, {
    title: "👨‍👨‍👦‍👦 Gang Daemon",
    w: 707,
    h: 420,
    x: 753,
    y: 374,
  });

  while (true) {
    ns.clearLog();
    gangRecruit(ns, cfg.TASKMAP.train);
    const info = ns.gang.getGangInformation();
    const wanted = gangIsWanted(info);
    const members = ns.gang.getMemberNames();

    const gangName = pad(info.faction, 15, "", true);
    const gangPower = pad(info.power.toFixed(2), 5, "", true);
    const gangTerritory = pad(ns.formatPercent(info.territory), 5, "", true);
    const gangWanted = pad(ns.formatPercent(info.wantedPenalty), 5, "", true);

    ns.print(ln);
    if (info.territoryWarfareEngaged) {
      ns.print(`${C.red}\t\t\t[TERRITORY WARFARE ENGAGED] `);
    }
    ns.print(
      `${C.yellow}${gangName}\t   POWER:${gangPower}   TERRITORY:${gangTerritory}  WANTED:${gangWanted}`
    );
    ns.print(ln);

    for (const member of members) {
      const minfo = ns.gang.getMemberInformation(member);
      const masc = gangMemberAscend(ns, member);
      if (buy) {
        gangBuy(ns, member);
      }
      const pow = getMemberPower(minfo);
      // Routine for creating gang
      // inGang / createGang Karma has to be 54000

      if (info.power > 2300 && !wanted) {
        ns.gang.setTerritoryWarfare(true);
      } else if (info.power < 2300 || wanted) {
        ns.gang.setTerritoryWarfare(false);
      }

      if (wanted) {
        ns.gang.setMemberTask(member, cfg.TASKMAP.wanted);
      } else if (members.length >= cfg.memberMax) {
        if (pow >= 200 && info.territoryWarfareEngaged) {
          if (info.territory < 0.95) {
            ns.gang.setMemberTask(member, cfg.TASKMAP.warfare);
          } else {
            if (FOCUS === "power" && !info.territoryWarfareEngaged) {
              ns.gang.setMemberTask(member, cfg.TASKMAP.warfare);
            } else if (FOCUS === "money") {
              ns.gang.setMemberTask(member, cfg.TASKMAP.money);
            }
          }
        } else if (pow < 200) {
          ns.gang.setMemberTask(member, cfg.TASKMAP.train)
        }
      } else {
        if (pow < 20) {
          ns.gang.setMemberTask(member, cfg.TASKMAP.train);
        } else {
          ns.gang.setMemberTask(member, cfg.TASKMAP.reputation);
        }
      }

      const ui = ns.gang.getMemberInformation(member);
      const name = pad(ui.name, 18, "", true);
      const task = pad(ui.task, 15, "", true);
      const mpow = pad(pow, 5, "", false);

      const augs = gangGetUIUpgrades(ui).join(" ");
      ns.print(`${name}${task}\t${mpow}\t${masc}\t${augs}`);
    }

    await ns.sleep(cfg.interval);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data, args) {
  const params = ["buy=false", "focus=power"];
  return [...params];
}

/*

  const gangs = ["Slum Snakes","Tetrads","The Syndicate","The Dark Army","Speakers for the Dead","NiteSec","The Black Hand"];
    // ns.gang.getChanceToWinClash("Tetrads");
    const mygang = ns.gang.getGangInformation()

  ns.ui.openTail();
  ns.clearLog();
  //const a = ns.gang.createGang
  //const x = ns.gang.getChanceToWinClash()
  ns.gang.getOtherGangInformation()
      const info = ns.gang.getOtherGangInformation();
      const info2 = ns.gang.getChanceToWinClash("Tetrads");
      ns.print(info2);

      ns.print(info);
}
      */
