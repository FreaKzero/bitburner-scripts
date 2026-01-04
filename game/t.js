import { goSidebar, goTravel } from "./lib/ui";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const port = ns.getPortHandle(1);

  while (true) {
    const data = port.read(); // Gibt "Hello from script A" zurück
    ns.tprint(data);
    await ns.sleep(2000);
  }
}
