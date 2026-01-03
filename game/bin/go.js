import { goCity, goLocation, goTravel, goSidebar } from "../lib/ui";
import {C} from '../lib/utils';



const getLine = (e) => {
  const txt = e.getAttribute("aria-label");

  if (txt.toLowerCase().includes('gym')) {
    return  `  💪🏼 ${txt}`
  }

  if (txt.toLowerCase().includes('enterprise') || txt.toLowerCase().includes('technologies') || txt.toLowerCase().includes('tek') || txt.toLowerCase().includes('omega software')) {
    return  `  🛒 ${txt}`
  }

  if (txt.toLowerCase().includes('slums')) {
    return  `  🔪 ${txt}`
  }

   if (txt.toLowerCase().includes('hospital')) {
    return  `  🚑 ${txt}`
  }

  if (txt.toLowerCase().includes('university') || txt.toLowerCase().includes('institute')) {
    return  `  🎓 ${txt}`
  }

  if (txt.toLowerCase().includes('stock')) {
    return  `  📈 ${txt}`
  }
  
   if (txt.toLowerCase().includes('travel')) {
    return  `  ✈️ ${txt}`
  }

    if (txt.toLowerCase().includes('arcade')) {
    return  `  🕹️ ${txt}`
  }

    if (txt.toLowerCase().includes('noodle')) {
    return  `  🍜 ${txt}`
  }

    if (txt.toLowerCase().includes('casino')) {
    return  `  🎡 ${txt}`
  }

    if (txt.includes('0x6C1')) {
    return  `  👾 Glitch (${txt} = 1729)`
  }
  return  `  🏴 ${txt}`
};

/** @param {import("..").NS } ns */
export async function main(ns) {
  const i = ns.args[0]?.trim() || undefined;
  const PLAYER = ns.getPlayer();

  if (i === "list") {
    goCity("just go anywhere");
    const doc = eval("document");
    const locs = [...doc.querySelectorAll(`span[aria-label]`)].map((e) => getLine(e)
    );
    goSidebar('terminal');  
    if (locs && locs.length) {
      
      ns.tprint(`\n${C.yellow}${PLAYER.city}${C.reset}\n` + locs.join('\n'));
    }
    return;
  }

  if (i === "map") {
    goCity("just go anywhere");
    return;
  }

  if (i === "work") {
    const myFactions = PLAYER.factions;
    const doc = eval("document");
    const a = doc.querySelectorAll(".MuiTable-root tr th");
    const workfor = Array.from(a).find((el) =>
      /Working\s+(for|at)/i.test(el.innerText)
    );

    if (workfor) {
      const faction = workfor.innerText
        .replace(/Working\s+(for|at)\s*/i, "")
        .trim();
      if (myFactions.includes(faction)) {
        goSidebar("factions");
        const a = doc.querySelectorAll(".factions-joined .MuiPaper-root");
        const find2 = [...a].find((a) => a.innerText.includes(faction));
        if (find2) {
          find2.querySelector("button").click();
        }
      } else {
        goSidebar("city");
        goCity(faction);
      }
    }

    return;
  }

  if (!i) {
    ns.tprintRaw(`

go list:
\t Prints list of Locations in current City

go work:
\t Opens faction or employer you are currently working for

go map: 
\t Opens the Citymap 

Locations:
\tT  Technician
\tG  Gym
\tU  University
\tS  Slums
\t$  Stock Market 
\tH  Hospital

Cities: (You are currently in ${PLAYER.city})
\tVolharen
\tSector-12
\tNew Tokyo
\tAevum
\tIshima
\tChongqing

Or go to location given by list
`);
    return;
  }

  if (i.length === 1) {
    if (["T", "G", "U", "S", "$"].includes(i.toUpperCase())) {
      goLocation(i.toUpperCase());
    } else {
      ns.tprintRaw(`${i} is not a valid Location`);
    }

    return;
  }

  if (["Volharen", "Sector-12", "New Tokyo", "Aevum", "Ishima", "Chongqing"].includes(i)) {
    goTravel(i);
    return;
  }

  goCity(i);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data, args) {
  return [
    "work",
    "map",
    "T",
    "G",
    "U",
    "S",
    "$",
    "H",
    "Volharen",
    "Sector-12",
    "New Tokyo",
    "Aevum",
    "Ishima",
    "Chongqing"
  ]
}
