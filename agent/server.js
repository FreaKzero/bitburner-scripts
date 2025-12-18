/** @param {import("..").NS } ns */
export async function main(ns) {
    const SERVER_PREFIX = "frk";

    const numServer = ns.getPurchasedServers().length;
	const maxServer = ns.getPurchasedServerLimit();

    if (numServer >= maxServer) {
		ns.print(`Maximum of Purchaseable Servers reached`)
		ns.exit();
	}
    
}