import { goCity, goTravel, goLocation } from "../lib/ui";
import { TRAVELMAP } from "../lib/const";
import { decorateLocationLine, fromFormat } from "../lib/utils";
/** @param {import("..").NS } ns */
export async function main(ns) {
  const i = ns.args[0]?.trim() || undefined;
  const PLAYER = ns.getPlayer();

  if (!i) {
    const current = TRAVELMAP.find((a) => a.city === PLAYER.city);
    if (current) {
      ns.tprintRaw(`Locations of ${current.city}`);
      current.locations.forEach((e) => {
        ns.tprintRaw(decorateLocationLine(e));
      });

      ns.tprintRaw(`
Fasttravel Identifiers:
  T  🛒 Technician
  G  💪🏼 Gym
  U  🎓 University
  S  🔪 Slums
  $  📈 Stock Market 
  H  💊 Hospital
      `);
      return;
    }
  }

  if (i.length === 1) {
    if (["T", "G", "U", "S", "$"].includes(i.toUpperCase())) {
      goLocation(i.toUpperCase());
    } else {
      ns.tprintRaw(`${i} is not a valid Location`);
    }
    return;
  }

  const foundCity = TRAVELMAP.find((a) => a.city === i);

  if (foundCity) {
    ns.tprintRaw(`Locations of ${foundCity.city}`);
    foundCity.locations.forEach((e) => {
      ns.tprintRaw(decorateLocationLine(e));
    });
    return;
  }

  const found = TRAVELMAP.find((a) => a.locations.find((b) => b.includes(i)));

  if (found) {
    if (PLAYER.city !== found.city) {
      if (PLAYER.money < fromFormat("200.000k")) {
        ns.tprintRaw("You dont have enough money to travel there");
        return;
      }
      goTravel(found.city);
    }

    goCity(i);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data, args) {
  const locs = Array.from(new Set([...TRAVELMAP.flatMap((o) => o.locations)]));
  const cities = TRAVELMAP.flatMap((o) => o.city);
  return [...locs, ...cities];
}
