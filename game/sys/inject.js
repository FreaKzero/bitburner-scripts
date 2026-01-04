/** @param {import("..").NS } ns */
export async function main(ns) {
  const styles = ns.read('./styles.js');
  const style = document.createElement("style")
  style.textContent = styles;
  document.head.appendChild(style)
}


