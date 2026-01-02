/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ps("home")
  .filter(i => i.filename.includes('stocks/'))
  .forEach(i => ns.kill(i.pid))
}
