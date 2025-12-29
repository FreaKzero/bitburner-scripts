import { findConnection } from "../lib/scan";
import { execTerm } from "../lib/ui";
import { disableLogs } from "../lib/utils";
import { SERVERS } from "../lib/const";

/** @param {import("..").NS } ns */
export async function main(ns) {
    const target = ns.args[0];
    const backdoor = ns.args[1];
   disableLogs(ns, ['scan']);
   const x = findConnection(ns, target);
   const p = x.map(a => `connect ${a};`).join('');
   const bd = backdoor && backdoor.trim() !== '' ? 'backdoor' : '';
   execTerm(`${p};${bd}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autocomplete(data, args) {     
    return SERVERS;
}