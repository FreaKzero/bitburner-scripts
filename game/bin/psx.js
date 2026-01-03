import { C, getRamBar, line, pad, setupTail, initState } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.clearLog();
  setupTail(ns, {
    title: " 📺 Monitor",
    w: 449,
    h: 400,
    x: 1655,
    y: 516,
  });

  const [state] = initState(ns);
  
  ns.atExit(() => {
    ns.ui.closeTail();
  });

  function render() {
    ns.clearLog();
    const host = "home";
    const attacked = state("attack");

    const ln = line(45, "black");
    const ram = getRamBar(ns);
    ns.print(ln);
    ns.print(`          ${ram.percent} ${ram.progress}`);
    ns.print(ln);
    ns.print(` 💻 ${ram.info}`);
    ns.print(ln);
    const processes = ns.ps(host).sort((a, b) => b.threads - a.threads);
    const ui = processes.map((a) => {
      const r = ns.getScriptRam(a.filename);
      return ` ${pad(a.filename, 15)}\t${pad(a.threads, 6, "", false)}${pad(
        ns.formatRam(r * a.threads),
        10,
        "",
        false
      )}  ${a.pid}`;
    });
    ns.print(ui.join("\n"));
    ns.print(ln);
    if (attacked) {
      ns.print(` 💥 ${C.red}Attack: ${attacked}`);
      ns.print(ln);
    }
  }

  while (true) {
    render();
    await ns.sleep(5000);
  }
}
