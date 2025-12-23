import { execTerm } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
    
    if (!ns.hasTorRouter()) {
        ns.exec('./tor.js', 'home');
        await ns.sleep(500);
    }

    execTerm('buy BruteSSH.exe');
    await ns.sleep(300);
    execTerm('buy FTPCrack.exe');
    await ns.sleep(300);
    execTerm('buy relaySMTP.exe');
    await ns.sleep(300);
    execTerm('buy HTTPWorm.exe');
    await ns.sleep(300);
    execTerm('buy SQLInject.exe');
}