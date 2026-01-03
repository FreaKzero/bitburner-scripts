import { execTerm } from "../lib/ui";
import { C, getRamBar, line, pad, setupTail, initState } from "../lib/utils";

function Processes({ list }) {
  const kill = async (pid) => {
    execTerm(`kill ${pid}`);
  };

  const style = {
    fontSize: "20px",
    background: "none",
    color: "red",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div>
      {list.map((a) => {
        return (
          <div>
            <button style={style} onClick={() => kill(a.pid)}>
              &times;
            </button>{" "}
            <span>{a.name}</span>
            {"\t     "}
            <span>{a.threads}</span>
            <span>{a.ram}</span>
            {"  "}
            <span>{a.pid}</span>
          </div>
        );
      })}
    </div>
  );
}

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.clearLog();
  setupTail(ns, {
    title: " 📺 Monitor",
    w: 500,
    h: 400,
    x: 1640,
    y: 568,
  });

  const [state] = initState(ns);

  ns.atExit(() => {
    ns.ui.closeTail();
  });

  function render() {
    ns.clearLog();
    const host = "home";
    const attacked = state("attack");
    const ln = line(51, "black");
    const processes = ns
      .ps(host)
      .sort((a, b) => b.threads - a.threads)
      .filter((a) => a.filename !== "bin/psx.jsx")
      .map((a) => {
        const r = ns.getScriptRam(a.filename);
        return {
          name: pad(a.filename, 20),
          threads: pad(a.threads, 6, "", false),
          ram: pad(ns.formatRam(r * a.threads), 10, "", false),
          pid: pad(a.pid, 3, "", false),
        };
      });

    const ram = getRamBar(ns);
    ns.print(ln);
    ns.print(`             ${ram.percent} ${ram.progress}`);
    ns.print(ln);
    ns.print(` 💻 ${ram.info}`);
    ns.print(ln);
    ns.printRaw(<Processes list={processes} />);
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
