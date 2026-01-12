import { goSidebar, reactClickButton, save } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
  const exp = ns.args[0] || false;

  if (exp) {
    goSidebar("Options");
    reactClickButton("Export Game");
  } else {
    save();
  }
}
