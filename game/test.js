import { $ } from "./lib/ui";

/** @param {import(".").NS} ns */
const btn = (label, callback) => {
  const doc = eval("document");
  const b = doc.createElement("button");
  b.innerText = label;
  b.onclick = callback;
  return b
};

export async function main(ns) {
  //ns.ui.closeAllSleeves();
  ns.tail();

  const $mnt = $(".drag > h6").filter((w) => w.textContent.includes("test.js"));

  if ($mnt) {
    $mnt[0].parentNode.parentNode.append(btn("your mom", () => ns.alert("hai")));
  } else {
    ns.alert("nope");
  }
}
