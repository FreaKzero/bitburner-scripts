/** @param {import("..").NS } ns */
export async function main(ns) {
  const styles = ns.read('style/styles.js');
  const style = document.createElement("style")
  style.textContent = styles;
  console.log(styles);
  document.head.appendChild(style)
}


