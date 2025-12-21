/** @param {import(".").NS } ns */
export async function goSidebar(where) {
  const sidebar = [...document.querySelectorAll(".MuiListItemText-root")];
  const match = sidebar.filter((s) =>
    s.textContent.toLocaleLowerCase().includes(where.toLocaleLowerCase())
  );

  if (match[0]) {
    match[0].click();
  }
}

/** @param {import(".").NS } ns */
export async function goMap(ns, where) {
  goSidebar("city");
  ns.sleep(500);
  const node = document.querySelector(`span[aria-label="${where}"]`);
  if (node) {
    node.click();
  }
}

export async function findElement(htmlClass, textInc, doClick = true) {
  const sidebar = [...document.querySelectorAll(htmlClass)];
  const match = sidebar.filter((s) =>
    s.textContent.toLocaleLowerCase().includes(textInc.toLocaleLowerCase())
  );

  if (match[0] && doClick) {
    match[0].click();
  }
}

export function execTerm(command) {
  const terminalInput = document.getElementById("terminal-input");
  terminalInput.value = command;

  const handler = Object.keys(terminalInput)[1];
  terminalInput[handler].onChange({ target: terminalInput });
  const enterEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: false,
    key: "Enter",
  });

  terminalInput.dispatchEvent(enterEvent);
}
