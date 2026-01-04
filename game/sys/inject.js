/** @param {import("..").NS } ns */
export async function main(ns) {
  
  const doc = eval("document");
  const styles = ns.read('./styles.js');
  const style = doc.createElement("style")
  style.textContent = styles;
  doc.head.appendChild(style)
}


