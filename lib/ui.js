
/**
 * Go to any Sidebar Menu Selection
 * terminal, script editor, active scripts, create program, stats, factions, augmentations, hacknet, city, travel, stock market
 *
 * @export
 * @async
 * @param {"terminal" | "script editor" | "active scripts" | "create program" | "stats" | "factions" | "augmentations" | "hacknet" | "city" | "travel" | "stock market"} where 
 */
export function goSidebar(where) {
  const sidebar = [...document.querySelectorAll(".MuiListItemText-root")];
  const match = sidebar.filter((s) =>
    s.textContent.toLocaleLowerCase().includes(where.toLocaleLowerCase())
  );

  if (match[0]) {
    match[0].click();
  }
}

/**
 * Navigate in City via Full Name Identifier (eg: Alpha Enterprises)
 *
 * @export
 * @async
 * @param {string} where 
 */
export function goCity(where) {
  goSidebar("city");
  const node = document.querySelector(`span[aria-label="${where}"]`);
  if (node) {
    node.click();
  }
}

// TODO check if there is something to confirm (!)

/**
* Accept confirmation Dialog
*
*
*/
export function acceptConfirm() {
  const dialog = Array.from(
    document.querySelectorAll('div[class*="paper"]')
  ).at(-1);
  const btns = dialog.querySelectorAll("button");
  btns[1].click();
}

/**
 * Travel to a certain City:
 * Volharen, Sector-12, New Tokyo, Aevum, Ishima
 *
 * @param {"Volharen" | "Sector-12" | "New Tokyo" | "Aevum" | "Ishima"} where
 */
export function goTravel(where) {
  goSidebar("travel");

  const cities = document.querySelectorAll('[class*="travel"]');
  const find = Array.from(cities).find((a) => a.innerText.trim() === where[0]);

  if (find) {
    find.click();
    acceptConfirm();
  }
}

/**
 * Go to a Locationmarker on a Citymap
 * T(echnician) G(ym) U(niversity) S(lums) $(Stock) 
 * For specific Locations use "goCity"
 *
 * @param where {"T" | "G" | "U" | "S", "$"}
 */
export function goLocation(where) {
  goSidebar("city");

  const cities = document.querySelectorAll('[class*="location"]');
  const find = Array.from(cities).find(
    (a) =>
      !a.getAttribute("aria-label").toLowerCase().includes("travel") &&
      a.innerText.trim().toLowerCase() === where.toLowerCase()
  );

  if (find) {
    find.click();
  }
}

/**
 * Find Element via Innertext search
 *
 * @export
 * @async
 * @param {string} html class selector
 * @param {string} innerText to search
 * @param {boolean} When found autoclick or return
 * @returns {Object} HTML Element when click is false
 */
export async function findElement(htmlClass, textInc, doClick = true) {
  const sidebar = [...document.querySelectorAll(htmlClass)];
  const match = sidebar.filter((s) =>
    s.textContent.toLocaleLowerCase().includes(textInc.toLocaleLowerCase())
  );

  if (match[0] && doClick) {
    match[0].click();
  } else {
    return match[0];
  }
}

/**
 * Execute in Terminal
 *
 * @export
 * @param {string} command
 */
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
