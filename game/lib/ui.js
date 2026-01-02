export function reactSetInput(placeholder, value) {
  const doc = eval("document");
  const input = Array.from(doc.querySelectorAll("input")).find(
    (i) => i.placeholder === placeholder
  );

  if (!input) {
    console.error("Input not found:", placeholder);
    return;
  }

  const fiberKey = Object.keys(input).find(
    (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactProps$")
  );

  if (!fiberKey) {
    console.error("React Fiber not found");
    return;
  }

  const fiber = input[fiberKey];

  const props =
    fiber.memoizedProps || fiber.pendingProps || fiber.return?.memoizedProps;

  if (!props || typeof props.onChange !== "function") {
    console.error("onChange handler not found");
    return;
  }

  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  ).set;

  nativeSetter.call(input, value);

  const fakeEvent = {
    isTrusted: true,
    target: input,
    currentTarget: input,
    type: "change",
    preventDefault() {},
    stopPropagation() {},
  };

  props.onChange(fakeEvent);
}

export function reactClickButton(text) {
  const doc = eval("document");
  const btn = Array.from(doc.querySelectorAll("button")).find(
    (b) => b.innerText.trim() === text
  );

  if (!btn) return console.error("Button not found:", text);

  const fiberKey = Object.keys(btn).find(
    (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactProps$")
  );

  if (!fiberKey) return console.error("React Fiber not found");

  const fiber = btn[fiberKey];

  const props =
    fiber.memoizedProps || fiber.pendingProps || fiber.return?.memoizedProps;

  if (!props || typeof props.onClick !== "function")
    return console.error("onClick handler not found");

  const fakeEvent = {
    isTrusted: true,
    type: "click",
    target: btn,
    currentTarget: btn,
    preventDefault() {},
    stopPropagation() {},
  };

  props.onClick(fakeEvent);
}


/**
 * Go to any Sidebar Menu Selection
 * terminal, script editor, active scripts, create program, stats, factions, augmentations, hacknet, city, travel, stock market
 *
 * @export
 * @async
 * @param {"terminal" | "script editor" | "active scripts" | "create program" | "stats" | "factions" | "augmentations" | "hacknet" | "city" | "travel" | "stock market"} where
 */
export function goSidebar(where) {
  const doc = eval("document");
  const sidebar = [...doc.querySelectorAll(".MuiListItemText-root")];
  const match = sidebar.filter((s) =>
    s.textContent.toLocaleLowerCase().includes(where.toLocaleLowerCase())
  );

  if (match[0]) {
    match[0].click();
  }
}

/**
 * Navigate in City via case insensitive name search lookup
 * roth => rothman university
 * joe => joe`s guns
 *
 * @export
 * @async
 * @param {string} w
 */
export function goCity(w) {
  const doc = eval("document");
  goSidebar("city");
  const locs = [...doc.querySelectorAll(`span[aria-label]`)].map((e) =>
    e.getAttribute("aria-label")
  );
  const found = locs
    .map((e) => e.toLowerCase().indexOf(w.toLowerCase()))
    .findIndex((a) => a > -1);

  if (found) {
    const node = doc.querySelector(`span[aria-label="${locs[found]}"]`);
    if (node) {
      node.click();
    }
  }
}

/**
 * Description placeholder
 *
 * @export
 */
export function getCityLocations() {
  const doc = eval("document");
  goSidebar("city");
  return [...doc.querySelectorAll(`span[aria-label]`)].map((e) =>
    e.getAttribute("aria-label")
  );
}

// TODO check if there is something to confirm (!)

/**
 * Accept confirmation Dialog
 *
 *
 */
export function acceptConfirm() {
  const doc = eval("document");
  const dialog = Array.from(doc.querySelectorAll('div[class*="paper"]')).at(-1);
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
  const doc = eval("document");
  goSidebar("travel");

  const cities = doc.querySelectorAll('[class*="travel"]');
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
 * @param where {"T" | "G" | "U" | "S" | "$" | "H"}
 */
export function goLocation(where) {
  const doc = eval("document");
  goSidebar("city");

  const cities = doc.querySelectorAll('[class*="location"]');
  const find = Array.from(cities).find(
    (a) =>
      !a.getAttribute("aria-label").toLowerCase().includes("travel") &&
      !a.getAttribute("aria-label").toLowerCase().includes("slums") &&
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
  const doc = eval("document");
  const sidebar = [...doc.querySelectorAll(htmlClass)];
  const match = sidebar.filter((s) =>
    s.textContent.toLowerCase().includes(textInc.toLowerCase())
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
  goSidebar("terminal");
  const doc = eval("document");
  const terminalInput = doc.getElementById("terminal-input");
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
