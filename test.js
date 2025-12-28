import { findElement, goCity, goLocation, goSidebar } from "./lib/ui";
import { fromFormat, replaceAll } from "./lib/utils";
import cfg from "./etc/stocks";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const doc = eval("document");
  goSidebar('stock market');
  while (true) {  
   if (
      !doc.querySelector("h4")?.innerText.includes("World Stock Exchange")
    ) {
      goSidebar("stock market");
    }
    await ns.sleep(2000);
  }
}
