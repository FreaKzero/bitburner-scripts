import { DARKWEB_PROGRAMS } from "../lib/const";
import { deepscan } from "../lib/scan";

/** @param {import("..").NS } ns */
export async function main(ns) {
  let O = ``;

  function useHacks(host) {
    for (const {program} of DARKWEB_PROGRAMS) {
      const exec = program.slice(0, -4).toLowerCase();
      if (ns.fileExists(program)) {
        ns[exec](host, 'home');
      }
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
      O += (`💥 Nuked: ${host}\n`);
      await ns.nuke(host);
    }
  }

  const servers = deepscan(ns);
  for (const serv of servers) {
    if (serv !== "home") {
      await crack(serv);
    }
  }
   ns.tprint(O);
}
