import { deepscan } from "../lib/scan";
import { getSolution } from "../lib/contract-solutions";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const servers = deepscan(ns);
  ns.disableLog('ALL');
  ns.ui.openTail();
  ns.ui.resizeTail(450, 150);

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
    let O = '';
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
    }
    await ns.sleep(5*60000);
  }
}
