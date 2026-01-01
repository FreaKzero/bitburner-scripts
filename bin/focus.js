import { execTerm, findElement } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
    execTerm('share');
    await ns.sleep(3000);
    findElement('button', 'Focus', true);
}