import { DARKWEB_PROGRAMS } from "../lib/const";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const haveTor = ns.hasTorRouter();
  const software = DARKWEB_PROGRAMS.map((cmd) => {
    return {
      ...cmd,
      exists: ns.fileExists(cmd.program),
    };
  });

  let OP = `Darkweb Purchase Agent \n`;
  OP += `Tor Router:\t\t${haveTor ? '✔️' : '❌'} \n`;
  
  software.forEach(a =>  {
    OP += `${a.program}:\t\t${a.exists ? '✔️' : '❌'} \n`
  });

  ns.tprint(OP);

/* 
cannot automate buying of that - maybe later ?
  while(true) {
    const moneyAvailable = ns.getPlayer().money;

    if (!hasTor && 200000 < moneyAvailable) {
    }
    await ns.sleep(20000);
  } */



  }

