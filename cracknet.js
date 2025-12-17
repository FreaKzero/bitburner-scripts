import { deepscan } from "./lib/scan";

/** @param {import(".").NS } ns */
export async function main(ns) {
  async function useHacks(host) {
    if (ns.fileExists("BruteSSH.exe", "home")) {
      ns.brutessh(host);
    }

    if (ns.fileExists("FTPCrack.exe", "home")) {
      ns.ftpcrack(host);
    }

    if (ns.fileExists("relaySMTP.exe", "home")) {
      ns.relaysmtp(host);
    }

    if (ns.fileExists("HTTPWorm.exe", "home")) {
      ns.httpworm(host)
    }

    if (ns.fileExists("SQLInject.exe", "home")) {
      ns.sqlinject(host);
    }
  }

  async function crack(host) {
    useHacks(host);
    const x = ns.getServer(host);
    const openPorts = [
      Number(x.smtpPortOpen),
      Number(x.httpPortOpen),
      Number(x.sshPortOpen),
      Number(x.sqlPortOpen),
      Number(x.ftpPortOpen),
    ].reduce((p, acc) => acc + p, 0);
    
    if (!x.hasAdminRights && openPorts >= x.numOpenPortsRequired) {
      ns.tprint(`New Host hacked: ${host}`);
      await ns.nuke(host);
    }
  }

  // main
  const servers = deepscan(ns);
  for (const serv of servers) {
    if (serv !== "home") {
      await crack(serv);
    }
  }
}
