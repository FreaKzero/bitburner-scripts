import { goCity, goTravel } from "../lib/ui";
import { TRAVELMAP } from "../lib/const";
import {fromFormat} from '../lib/utils';
/** @param {import("..").NS } ns */
export async function main(ns) {
  
  const i = ns.args[0]?.trim() || undefined;
  const PLAYER = ns.getPlayer();

  if (PLAYER.money < fromFormat('200.000k')) {
    return;
  }

  const found = TRAVELMAP.find(a => a.locations.find(b => b.includes(i)));
  
  if (found) {
    if (PLAYER.city !== found.city) {
        goTravel(found.city)
    }
    goCity(i);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars 
export function autocomplete(data, args) {
  const params = Array.from(new Set([...TRAVELMAP.flatMap(o => o.locations)]));
  return [...params]
}
