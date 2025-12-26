import {C} from '../lib/const';
import { pad } from '../lib/utils';

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.openTail();
  ns.ui.resizeTail(450, 200);
  ns.disableLog('ALL');

const cracks = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
  const openPorts = cracks.reduce((acc, cur) => {
    acc += ns.fileExists(cur) ? 1 : 0;
    return acc;
  }, 0);


  const list = [
    { host: "CSEC", lvl: 60, ports: 1 },
    { host: "avmnite-02h", lvl: 220, ports: 2 },
    { host: "run4theh111z", lvl: 538, ports: 4 },
    { host: "I.I.I.I", lvl: 346, ports: 3 },
    { host: "powerhouse-fitness", lvl: 1031, ports: 5 },
    { host: "The-Cave", lvl: 925, ports: 5 },
  ].sort((a, b) => a.lvl - b.lvl);

   let O = ``;
    ns.clearLog();

    for (const h of list) {
      const s = ns.getServer(h.host);
      const skill = ns.getPlayer().skills.hacking;
      const left = h.lvl - skill;

      if (!s.backdoorInstalled && (skill >= h.lvl && h.ports <= openPorts)) {
        ns.print(`\t   Please Wait ...`);
        ns.print(`\t   🖥️ Hacking ${h.host}\n\n\n\n`);
        ns.exec('bin/conn.js', 'home', 1, h.host, 'true');
      }
      ns.clearLog();
      O += `${ns.backdoorInstalled ? C.green : C.red}${ns.backdoorInstalled ? "✔️" : "❌"}  ${pad(left > 0 ? left : 0, 3, '', false)}  ${h.host} ${C.reset}\n`;
    }

    ns.print(O);
}
