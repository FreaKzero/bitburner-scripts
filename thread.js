import { DISTFILES } from "./lib/const";
import { getThreads } from "./lib/utils";

/** @param {import(".").NS } ns */
export async function main(ns) {
    const host = ns.args[0] || null;
    const script = ns.args[1] || null;
    const args = ns.args[2] || '';

    if (!host) {
        const script = await ns.prompt('Script:', {type: 'select', choices: DISTFILES});
        const args = await ns.prompt('args:', {type: 'text'});
        const threads = getThreads(ns, 'home', script);
        ns.exec(script, 'home', threads, args);
    }

    if (host && script) {
        const threads = getThreads(ns, host, script);
        ns.exec(script, host, threads, args);
    }
}