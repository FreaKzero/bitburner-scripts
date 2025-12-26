import { deepscan } from "../lib/scan";
import { DISTFILES } from "../lib/const";
import { getArgs, state } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const { script, host, home } = getArgs(ns, {
    script: "dist/auto.js",
    host: null,
    home: true,
  });

  const servers = deepscan(ns);


  if (host && ['auto.js','hack.js','weak.js','grow.js'].some(s => script.includes(s))) {
    state(ns, 'attack', host);
  } else {
    state(ns, 'attack', '');
  }

  for (const serv of servers) {
    if (serv !== "home") {
      ns.killall(serv);
      ns.scp(DISTFILES, serv);

      const aRam = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv);
      const sRam = ns.getScriptRam(script);
      const threads = Math.floor(aRam / sRam);
      const rattack = host || serv;
      ns.exec(script, serv, threads || 1, rattack);
    }
  }

  if (home) {
    const aRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
    const sRam = ns.getScriptRam(script);
    const threads = Math.floor(aRam / sRam);
    const rattack = host || "home";
    ns.exec(script, "home", threads || 1, rattack);
  }
}
