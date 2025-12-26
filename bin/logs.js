/** @param {import("..").NS } ns */
export async function main(ns) {
  const ps = ns.ps("home");

  ps.filter((a) => a.filename !== "bin/logs.js").forEach((c) => {
    ns.ui.openTail(c.pid);
    if (c.filename.includes("dist/")) {
      ns.ui.resizeTail(450, 150, c.pid);
    }
  });
}
