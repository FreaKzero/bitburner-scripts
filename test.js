import { findElement, goTravel } from "./lib/ui";

export function goLocation(where) {
  goTravel("city");

  const cities = document.querySelectorAll('[class*="location"]');
  const find = Array.from(cities).find((a) => a.innerText.trim().toLowerCase() === where.toLowerCase());

  if (find) {
    find.click();
  }
}

/** @param {import(".").NS } ns */
export async function main(ns) {
 goTravel()   
}
