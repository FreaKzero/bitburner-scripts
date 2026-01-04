import { findElement, save } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main() {
    save();
    findElement('button', 'Focus', true);
}