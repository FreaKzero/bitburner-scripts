import { execTerm, findElement } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main() {
    findElement('button', 'Focus', true);
}