/** @param {import("../").NS } ns */
export async function main(ns) {
    let target = ns.args[0] || ns.getHostname();
    let securityLevelMin;
    let currentSecurityLevel;
    let serverMaxMoney;
    let serverMoneyAvailable;

    while (true) {
        securityLevelMin = ns.getServerMinSecurityLevel(target);  
        currentSecurityLevel = ns.getServerSecurityLevel(target);

        while (currentSecurityLevel > securityLevelMin + 5) {
            await ns.weaken(target);
            currentSecurityLevel = ns.getServerSecurityLevel(target)
        }
        serverMoneyAvailable = ns.getServerMoneyAvailable(target);
        serverMaxMoney = ns.getServerMaxMoney(target);

        while (serverMoneyAvailable < (serverMaxMoney * 0.75)) {
            await ns.grow(target);
            serverMoneyAvailable = ns.getServerMoneyAvailable(target);
            serverMaxMoney = ns.getServerMaxMoney(target);
        }

        await ns.hack(target);
        serverMoneyAvailable = ns.getServerMoneyAvailable(target)
        serverMaxMoney = ns.getServerMaxMoney(target);
    }
}