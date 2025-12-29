import { findElement, goCity, goLocation, goSidebar } from "./lib/ui";
import { fromFormat, replaceAll } from "./lib/utils";
import cfg from "./etc/stocks";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const doc = eval("document");
  goSidebar("factions");
  const a = doc.querySelectorAll(".MuiTable-root tr th");
  const find = Array.from(a).find((a) => a.innerText.includes("Working for"));

  if (find) {
    const faction = find.innerText.replace("Working for ", "").trim();
    const a = doc.querySelectorAll(".factions-joined .MuiPaper-root");
    const find2 = [...a].find((a) => a.innerText.includes(faction));
    find2.querySelector("button").click();
  }
}
