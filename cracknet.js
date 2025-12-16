import { deepscan } from "./lib/scan";
import { HACKS } from "./lib/const";

/** @param {import(".").NS } ns */
export async function main(ns) {
  async function useHacks(host) {
    HACKS.forEach((hack) => {
      if (ns.fileExists(hack, "home")) {
        const method = hack.toLowerCase().slice(0, -4);
        if (ns[method]) {
          ns[method](host);
        }
      }
    });
  }

  async function crack(host) {
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
      await ns.hack(host);
      return 1;
    } else {
      useHacks(host);
      return 0;
    }
  }

  // main
  const servers = deepscan(ns);

  for (const serv of servers) {
    await crack(serv);
  }
}
