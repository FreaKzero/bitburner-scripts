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
  const ln = line(74, "black");

  const { buy, focus, war } = getArgs(ns, {
    buy: true,
    focus: false,
    war: false,
  });

    const FOCUS = focus && focus.toLowerCase() ||
    await ns.prompt("Select Focus", {
      type: "select",
      choices: [
        "respect",
        "money",
        "power"
      ],
    });

  setupTail(ns, {
    title: `👨‍👨‍👦‍👦 Gang Daemon [${FOCUS.toUpperCase()}]`,
    w: 715,
    h: 501,
    x: 921,
    y: 283,
  });

  while (true) {
    ns.clearLog();
    gangRecruit(ns, cfg.TASKMAP.train);
    const info = ns.gang.getGangInformation();
    const wanted = gangIsWanted(info);
    const members = ns.gang.getMemberNames();

    const gangName = pad(info.faction, 10, "", true);
    const gangPower = pad(info.power.toFixed(2), 1, "⚔️", false);
    const gangTerritory = pad(ns.formatPercent(info.territory), 3, "", false);
    const gangWanted = pad(info.wantedLevel.toFixed(2), 3, "", false);

    const gangMoneyGain =
      info.moneyGainRate > 0
        ? pad(`${ns.formatNumber(info.moneyGainRate)}/s`, 9, "💸$", true)
        : "";

    const gangRespectGain =
      info.respectGainRate > 0
        ? pad(`${ns.formatNumber(info.respectGainRate)}/s`, 9, "🤝", true)
        : "";

    ns.print(ln);
    if (info.territoryWarfareEngaged) {
      ns.print(`${C.red}\t\t\t[TERRITORY WARFARE ENGAGED] `);
    }
    ns.print(
      `${C.yellow} ${gangName}  ${gangPower} 🗺️${gangTerritory} 👮${gangWanted} ${gangMoneyGain}${gangRespectGain}`
    );
    ns.print(ln);
    ns.print(
      `${C.white} MEMBER\t\t\t        TASK   ⚔️  🚀\t\t       INVENTORY${C.reset}`
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
      if (!wanted) {
        if (info.power > 2300 && war) {
          ns.gang.setTerritoryWarfare(true);
        } else if (info.power < 2300 && !wanted) {
          ns.gang.setTerritoryWarfare(false);
        }
      }

      if (wanted) {
        if (!info.territoryWarfareEngaged) {
          ns.gang.setTerritoryWarfare(false);
        }
        ns.gang.setMemberTask(member, cfg.TASKMAP.wanted);
      } else if (members.length >= cfg.memberMax) {
        if (pow >= 170 && info.territoryWarfareEngaged) {
          if (info.territory < 0.95) {
            ns.gang.setMemberTask(member, cfg.TASKMAP.warfare);
          } else {
            if (FOCUS === "power" && !info.territoryWarfareEngaged) {
              ns.gang.setMemberTask(member, cfg.TASKMAP.warfare);
            } else if (FOCUS === "money") {
              ns.gang.setMemberTask(member, cfg.TASKMAP.money);
            } else if (FOCUS === "respect") {
              ns.gang.setMemberTask(member, cfg.TASKMAP.reputation);
            }
          }
        } else if (pow < 20) {
          ns.gang.setMemberTask(member, cfg.TASKMAP.train);
        } else {
          if (FOCUS === "power" && !info.territoryWarfareEngaged) {
            ns.gang.setMemberTask(member, cfg.TASKMAP.warfare);
          } else if (FOCUS === "money") {
            ns.gang.setMemberTask(member, cfg.TASKMAP.money);
          } else if (FOCUS === "respect") {
            ns.gang.setMemberTask(member, cfg.TASKMAP.reputation);
          }
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
      const mpow = pad(pow, 3, "", false);

      const augs = gangGetUIUpgrades(ui).join(" ");
      ns.print(` ${name}${task}  ${mpow}  ${masc}  ${augs}`);
    }
    ns.print(ln);
    await ns.sleep(cfg.interval);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data, args) {
  const params = ["buy=false", "focus=power", "focus=respect", "focus=money", "war=true"];
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
