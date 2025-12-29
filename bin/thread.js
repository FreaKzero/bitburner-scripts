import { getThreads } from "../lib/utils";
import cfg from '../etc/sys';

/** @param {import("..").NS } ns */
export async function main(ns) {
    const script = ns.args[0] || null;
    const args = ns.args[1] || '';

        ns.ui.openTail(script);
        const threads = getThreads(ns, 'home', script);
        ns.exec(script, 'home', threads, args);
}
 export function autocomplete(data, args) {     
    return cfg.dist;      
}