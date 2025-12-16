import { deepscan } from "./lib/scan";

//@TODO - check filenames of all
const HACKS = ["BruteSSH.exe"];

/** @param {import(".").NS } ns */
export async function main(ns) {
  const log = ns.tprintRaw;

  async function useHacks(host) {
    HACKS.forEach((hack) => {
      if (ns.fileExists(hack, "home")) {
        const method = hack.toLowerCase().slice(0, -4);
        if (ns[method]) {
          ns[method](host);
        } else {
          log("Error: Methodname doesnt exist");
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
      await ns.nuke(host);
      await ns.hack(host);
      ns.scp(["dist/auto.js"], host, "home");
      ns.exec("dist/auto.js", host);
      return 1;
    } else if (x.hasAdminRights) {
      ns.scp(["dist/auto.js"], host, "home");
      ns.exec("dist/auto.js", host);
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
