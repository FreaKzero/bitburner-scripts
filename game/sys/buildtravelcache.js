import { fromFormat } from "../lib/utils";
import { goTravel } from "./lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const cities = [
    "Volharen",
    "Sector-12",
    "New Tokyo",
    "Aevum",
    "Ishima",
    "Chongqing",
  ];

  const neededMoney = fromFormat('200.000k') * cities.length;

  if (ns.getPlayer().money < neededMoney) {
    ns.tprintRaw('You dont have enough money to build the travelcache');
    return;
  }

  const travelmap = []
  for (const city of cities) {
    let obj = {city: city};
    goTravel(city);
    await ns.sleep(1500);
    const doc = eval("document");
    obj.locations = [...doc.querySelectorAll(`span[aria-label]`)].map((e) => e.getAttribute("aria-label"))
    travelmap.push(obj);
  } 
  
  // TODO refactor TRAVELMAP - we need own file for that
}