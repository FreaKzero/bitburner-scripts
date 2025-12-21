import { findElement, goMap, goSidebar } from "./lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
goMap(ns, 'Alpha Enterprises');
findElement('.MuiButtonBase-root', 'TOR router', true);
goSidebar('Terminal');
}


