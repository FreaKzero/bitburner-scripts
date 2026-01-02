/** @param {import("..").NS } ns */
export async function main(ns) {
    let target = ns.args[0] || null;

    if (!target) {
        return;
    }
    
    while(true) {
        await ns.hack(target);
    }
}