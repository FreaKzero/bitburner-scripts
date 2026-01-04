import { goSidebar, goTravel } from "./lib/ui";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const cities = [
    "Volharen",
    "Sector-12",
    "New Tokyo",
    "Aevum",
    "Ishima",
    "Chongqing",
  ];

  const travelmap = []
  for (const city of cities) {
    let obj = {city: city};
    goTravel(city);
    await ns.sleep(1500);
    const doc = eval("document");
    obj.locations = [...doc.querySelectorAll(`span[aria-label]`)].map((e) => e.getAttribute("aria-label"))
    travelmap.push(obj);
  } 
  goSidebar('terminal')
  
}