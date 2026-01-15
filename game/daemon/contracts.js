import { deepscan } from "../lib/scan";
import { getSolution } from "../lib/contract-solutions";
import { C, setupTail } from "../lib/utils";
import cfg from "../etc/sys";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const servers = deepscan(ns);
  ns.disableLog("ALL");
  setupTail(ns, {
    title: "📜 Contractwork Daemon",
    w: 500,
    h: 200,
    x: 1640,
    y: 120,
    silent: true
  });

  const getContractCollection = () => {
    let contracts = [];
    for (const host of servers) {
      const files = ns.ls(host, ".cct");
      if (files.length) {
        contracts.push(
          ...files.map((fileName) => {
            return {
              server: host,
              type: ns.codingcontract.getContractType(fileName, host),
              fileName: fileName,
              data: ns.codingcontract.getData(fileName, host),
            };
          })
        );
      }
    }
    return contracts;
  };

  while (true) {
    ns.clearLog();
    let O = "";
    const contracts = getContractCollection();

    if (contracts.length) {
      for await (const contract of contracts) {
        const solution = getSolution(contract);
        if (solution != "Unsolvable") {
          const result = ns.codingcontract.attempt(
            solution,
            contract.fileName,
            contract.server,
            { returnReward: true }
          );

          O += `📝Solve Attempt for ${contract.type}\n`;
          O += `🏆${result}\n\n`;
        }

        ns.print(O);
        await ns.sleep(500);
      }
    } else {
      ns.print(`${C.magenta}\t    ⏳ Waiting for Contractwork ⏳\n\n\n\n`);
    }
    await ns.sleep(cfg.contractCheckInterval);
  }
}
