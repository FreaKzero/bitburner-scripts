export function $(selector) {
   const doc = eval("document");
   const elements = [...doc.querySelectorAll(selector)];
   return elements;
}

export function $$(selector) {
   const doc = eval("document");
   return doc.querySelector(selector);
}

/**
 * Exit the current "focus" state if a focus dialog is active.
 *
 * Detects the Bitburner focus modal (e.g. "You are currently …")
 * and programmatically clicks the option to continue without focus.
 *
 * @export
 */
export function exitFocus() {
  const hasFocus = $(".MuiPaper-root > .MuiTypography-h6")
  .find((a) => a.innerText.includes("You are currently"));

  if (hasFocus) {
    reactClickButton("Do something else simultaneously");
  }
}

/**
 * Check whether a given view or context is currently visible/active.
 *
 * - Searches for matching `<h4>` headlines
 * - Falls back to checking the currently active list item
 * - Special case: `"focus"` checks for the focus dialog headline
 *
 * @export
 * @param {string} text - Case-insensitive text to search for
 * @returns {boolean|HTMLElement} `true` if found, `false` otherwise.
 * If `text === "focus"`, returns the matching HTMLElement instead.
 */
export function inView(text) {
  const compare = text.toLowerCase();

  const hasHeadline = $('h4').find((a) =>
    a.innerText.toLowerCase().includes(compare)
  );

  if (text === "focus") {
    return $(".MuiPaper-root > .MuiTypography-h6").find(
      (a) => a?.innerText?.includes("You are currently")
    );
  }

  if (hasHeadline) {
    return true;
  } else {
    const active = $('[class*="listitem-active"]')
      ?.innerText.toLowerCase()
      ?.includes(compare);
    if (active) {
      return true;
    }
  }

  return false;
}

/**
 * Programmatically set the value of a React-controlled `<input>` element.
 *
 * Locates an input by its placeholder text, sets its native value,
 * and manually triggers React's `onChange` handler via the internal Fiber.
 *
 * @export
 * @param {string} placeholder - Placeholder text of the target input
 * @param {string} value - Value to set
 */
export function reactSetInput(placeholder, value) {
  const input = $('input').find(
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

/**
 * Focus a React-controlled input element and optionally set its value.
 *
 * Triggers native focus, calls React's `onFocus`, updates the value via
 * the native setter, and finally fires React's `onChange`.
 *
 * @export
 * @param {HTMLElement} el - Target element
 * @param {string} value - Value to set after focusing
 */
export function reactFocus(el, value) {
  if (!(el instanceof HTMLElement)) return console.error("Invalid element");

  const fiberKey = Object.keys(el).find(
    (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactProps$")
  );

  if (!fiberKey) return console.error("React Fiber not found");

  const fiber = el[fiberKey];

  const props =
    fiber.memoizedProps || fiber.pendingProps || fiber.return?.memoizedProps;

  el.focus();

  props?.onFocus?.({
    isTrusted: true,
    type: "focus",
    target: el,
    currentTarget: el,
  });

  const nativeSetter = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(el),
    "value"
  )?.set;

  if (!nativeSetter) return console.error("No native value setter");

  nativeSetter.call(el, value);

  props?.onChange?.({
    isTrusted: true,
    type: "change",
    target: el,
    currentTarget: el,
  });
}

/**
 * Programmatically click a React-controlled button.
 *
 * Accepts either a button label (exact match on `innerText`)
 * or a direct HTMLElement reference.
 *
 * @export
 * @param {string|HTMLElement} target - Button text or element
 */
export function reactClickButton(target) {

  const btn =
    typeof target === "string"
      ? $('button').find(
          b => b.innerText.toLowerCase().trim() === target.toLowerCase()
        )
      : target instanceof HTMLElement
        ? target
        : null;

  if (!btn) return console.error("Button not found:", target);

  const fiberKey = Object.keys(btn).find(
    k => k.startsWith("__reactFiber$") || k.startsWith("__reactProps$")
  );

  if (!fiberKey) return console.error("React Fiber not found");

  const fiber = btn[fiberKey];

  const props =
    fiber.memoizedProps ||
    fiber.pendingProps ||
    fiber.return?.memoizedProps;

  if (typeof props?.onClick !== "function")
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
 * Navigate to a sidebar menu entry.
 *
 * Supported entries include:
 * terminal, script editor, active scripts, create program, stats,
 * factions, augmentations, hacknet, city, travel, stock market
 *
 * Automatically exits focus mode if active.
 *
 * @export
 * @param {"terminal" | "script editor" | "active scripts" | "create program" | "stats" | "factions" | "augmentations" | "hacknet" | "city" | "travel" | "stock market"} where
 */
export function goSidebar(where) {
  exitFocus();
  const match = $(".MuiListItemText-root").filter((s) =>
    s.textContent.toLocaleLowerCase().includes(where.toLocaleLowerCase())
  );

  if (match[0]) {
    match[0].click();
  }
}

/**
 * Navigate to a city location using a fuzzy, case-insensitive lookup.
 *
 * Examples:
 * - "roth" → Rothman University
 * - "joe"  → Joe's Guns
 *
 * @export
 * @param {string} w - Partial city location name
 */
export function goCity(w) {
  goSidebar("city");
  const locs = $('span[aria-label]').map((e) =>
    e.getAttribute("aria-label")
  );
  const found = locs
    .map((e) => e.toLowerCase().indexOf(w.toLowerCase()))
    .findIndex((a) => a > -1);

  if (found) {
    const node = $('span[aria-label="${locs[found]}"]')
    if (node) {
      node.click();
    }
  }
}

/**
 * Retrieve all available city locations.
 *
 * Automatically navigates to the city view before reading markers.
 *
 * @export
 * @returns {string[]} List of city location names
 */
export function getCityLocations() {
  goSidebar("city");
  return $('span[aria-label]').map((e) =>
    e.getAttribute("aria-label")
  );
}

/**
 * Accept the currently visible confirmation dialog.
 *
 * Assumes the last rendered dialog is the active one and
 * clicks the confirm/accept button.
 *
 * @export
 */
export function acceptConfirm() {
  // TODO remove the .at(-1)
  const dialog = $('div[class*="paper"]').at(-1);
  const btns = dialog.querySelectorAll("button");
  btns[1].click();
}

/**
 * Travel to a specific city.
 *
 * Supported destinations:
 * Volharen, Sector-12, New Tokyo, Aevum, Ishima
 *
 * Automatically confirms the travel dialog.
 *
 * @export
 * @param {"Volharen" | "Sector-12" | "New Tokyo" | "Aevum" | "Ishima"} where
 */
export function goTravel(where) {
  goSidebar("travel");
  const find = $('travel').find((a) => a.innerText.trim() === where[0]);

  if (find) {
    find.click();
    acceptConfirm();
  }
}

/**
 * Navigate to a location marker on the city map.
 *
 * Shortcuts:
 * - T → Technician
 * - G → Gym
 * - U → University
 * - S → Slums
 * - $ → Stock Market
 * - H → Hospital
 *
 * For specific named locations, use {@link goCity}.
 *
 * @export
 * @param {"T" | "G" | "U" | "S" | "$" | "H"} where
 */
export function goLocation(where) {
  goSidebar("city");

  const find = $('class*="location"').find(
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
 * Find an element by CSS selector and innerText match.
 *
 * Optionally clicks the element automatically.
 *
 * @export
 * @param {string} htmlClass - CSS selector
 * @param {string} textInc - Case-insensitive innerText fragment
 * @param {boolean} [doClick=true] - Click when found
 * @returns {HTMLElement|undefined} Found element if `doClick` is false
 */
export async function findElement(htmlClass, textInc, doClick = true) {
  const match = $(htmlClass).filter((s) =>
    s.textContent.toLowerCase().includes(textInc.toLowerCase())
  );

  if (match[0] && doClick) {
    match[0].click();
  } else {
    return match[0];
  }
}

/**
 * Execute a command in the Bitburner terminal.
 *
 * Navigates to the terminal, injects the command, and
 * simulates an Enter key press.
 *
 * @export
 * @param {string} command - Terminal command to execute
 */
export function execTerm(command) {
  goSidebar("terminal");
  const terminalInput = $$("#terminal-input");

  if (terminalInput) {
    reactFocus(terminalInput);
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
}

/**
 * Trigger a save action in the script editor.
 *
 * Locates the save icon and clicks its parent button
 * via React's internal event handling.
 *
 * @export
 */
export function save() {
  const saveBtn =  $('.react-draggable svg').filter(e => e.getAttribute("data-testid") === "SaveIcon")[0];
  reactClickButton(saveBtn.parentElement);
}
