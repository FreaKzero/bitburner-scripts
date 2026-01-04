import { initState } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [exit, setExit] = initState(ns, "StockExit");
  setExit(true);
}
