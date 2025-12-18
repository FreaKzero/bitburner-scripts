import { findConnection } from "./lib/scan";
import { disableLogs } from "./lib/utils";

/** @param {import(".").NS } ns */
export async function main(ns) {
    const target = ns.args[0];

   disableLogs(ns, ['scan']);
   const x = findConnection(ns, target);
   const p = x.map(a => `connect ${a};`).join('');
   navigator.clipboard.writeText(p);
}

