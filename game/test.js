import { goSidebar, goTravel } from "./lib/ui";

/** @param {import(".").NS } ns */
export async function main(ns) {
    const port = ns.getPortHandle(1);
    port.write("Hello from script A");
}