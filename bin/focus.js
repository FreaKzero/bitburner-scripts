import { execTerm, findElement } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
    execTerm('share');
    await ns.sleep(1500);
    findElement('button', 'Focus', true);
}