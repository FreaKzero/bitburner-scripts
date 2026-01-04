
export const decorateLocationLine = (txt) => {
  if (txt.toLowerCase().includes('gym')) {
    return  `  💪🏼 ${txt}`
  }

  if (txt.toLowerCase().includes('enterprise') || txt.toLowerCase().includes('technologies') || txt.toLowerCase().includes('tek') || txt.toLowerCase().includes('omega software')) {
    return  `  🛒 ${txt}`
  }

  if (txt.toLowerCase().includes('slums')) {
    return  `  🔪 ${txt}`
  }

   if (txt.toLowerCase().includes('hospital')) {
    return  `  💊 ${txt}`
  }

  if (txt.toLowerCase().includes('university') || txt.toLowerCase().includes('institute')) {
    return  `  🎓 ${txt}`
  }

  if (txt.toLowerCase().includes('stock')) {
    return  `  📈 ${txt}`
  }
  
   if (txt.toLowerCase().includes('travel')) {
    return  `  ✈️ ${txt}`
  }

    if (txt.toLowerCase().includes('arcade')) {
    return  `  🕹️ ${txt}`
  }

    if (txt.toLowerCase().includes('noodle')) {
    return  `  🍜 ${txt}`
  }

    if (txt.toLowerCase().includes('casino')) {
    return  `  🎡 ${txt}`
  }

    if (txt.includes('0x6C1')) {
    return  `  👾 Glitch (${txt} = 1729)`
  }
  return  `  🏴 ${txt}`
};

/**
 * Helper utility for Tail window setup.
 *
 * Intended to be used during development (e.g. together with a `windev`
 * or similar workflow). Opens the Tail window and optionally applies
 * title, size, and screen position.
 *
 * @export
 * @param {import("..").NS} ns - Bitburner Netscript API
 * @param {{
 *   w?: number;
 *   h?: number;
 *   x?: number;
 *   y?: number;
 *   title?: string;
 * }} [opt={}] - Optional Tail configuration
 */
export function setupTail(ns, opt = {}) {
  if (!opt) return;

  ns.ui.openTail();
  if (opt.title) {
    ns.ui.setTailTitle(` ${opt.title}`);
  }

  if (opt.w && opt.h) {
    ns.ui.resizeTail(opt.w, opt.h);
  }
  if (opt.x && opt.y) {
    ns.ui.moveTail(opt.x, opt.y);
  }
}

/**
 * Development helper to pretty-print objects.
 *
 * Outputs the given payload to:
 * - terminal (`tprint`)
 * - script log (`print`)
 * - browser console
 *
 * @export
 * @param {import("..").NS} ns - Bitburner Netscript API
 * @param {any} p - Data to inspect
 */
export function dev(ns, p) {
  const x = JSON.stringify(p, null, 2);
  ns.tprint(`/*\n${x}\n*/`);
  ns.print(`/*\n${x}\n*/`);
  console.log(x);
}

/**
 * Generate a textual RAM usage bar for a server.
 *
 * Returns a colored progress bar along with human-readable RAM usage
 * and percentage values.
 *
 * @export
 * @param {import("..").NS} ns - Bitburner Netscript API
 * @param {string} [host="home"] - Target server hostname
 * @returns {{
 *   progress: string;
 *   info: string;
 *   percent: string;
 * }} RAM usage display information
 */
export function getRamBar(ns, host = "home") {
  const all = ns.getServerMaxRam(host);
  const used = ns.getServerUsedRam(host);

  const per = Math.ceil((100 * used) / all);
  const ui = Math.ceil(per / 5) * 5;

  const col = per < 50 ? C.green : per < 80 ? C.yellow : C.red;

  let bars = `${col}`;

  for (let idx = 5; idx < 100; idx += 5) {
    if (idx <= ui) {
      bars += "|";
    } else {
      bars += ".";
    }
  }

  return {
    progress: `${C.white}[${C.reset}${bars}${C.white}]${C.reset}`,
    info: `${ns.formatRam(used)}/${ns.formatRam(all)}`,
    percent: `${col}${per}%${C.reset}`,
  };
}

/**
 * ANSI color escape codes for terminal output.
 *
 * @readonly
 */
export const C = {
  black: "\u001b[30m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
  white: "\u001b[37m",
  brightBlack: "\u001b[30;1m",
  brightRed: "\u001b[31;1m",
  brightGreen: "\u001b[32;1m",
  brightYellow: "\u001b[33;1m",
  brightBlue: "\u001b[34;1m",
  brightMagenta: "\u001b[35;1m",
  brightCyan: "\u001b[36;1m",
  brightWhite: "\u001b[37;1m",
  reset: "\u001b[0m",
};

/**
 * Replace multiple words in a string using a lookup map.
 *
 * All keys in the map are matched case-insensitively and replaced
 * with their corresponding values.
 *
 * @param {string} str - Input string
 * @param {Object.<string, string>} mapObj - Search/replace map
 * @returns {string} The transformed string
 */
export function replaceAll(str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

  return str.replace(re, function (matched) {
    return mapObj[matched.toLowerCase()];
  });
}

/**
 * Create a horizontal separator line.
 *
 * Optionally applies ANSI color codes and allows customization
 * of line length and fill character.
 *
 * @param {number} [ln=90] - Line length
 * @param {keyof typeof C | null} [color=null] - Optional color
 * @param {string} [what="="] - Character to repeat
 * @returns {string} Generated line
 */
export const line = (ln = 90, color = null, what = "=") => {
  const line = new Array(ln).fill(what).join("");
  if (color) {
    return `${C[color]}${line}`;
  }
  return line;
};

/**
 * Disable Netscript log entries.
 *
 * Always disables `disableLog` itself and any additional
 * log functions provided.
 *
 * @param {import("..").NS} ns - Bitburner Netscript API
 * @param {string[]} array - List of log function names to disable
 */
export function disableLogs(ns, array) {
  ["disableLog", ...array].forEach((str) => {
    ns.disableLog(str);
  });
}

/**
 * Initialize a simple global state store backed by a JSON file.
 *
 * Provides getter and setter functions to persist values
 * across script executions.
 *
 * @export
 * @param {import("..").NS} ns - Bitburner Netscript API
 * @returns {[
 *   (key?: string) => any,
 *   (key: string, value?: any) => any
 * ]} Tuple of `[getState, setState]`
 */
export function initState(ns) {
  const F = "/var/global.json";

  const setState = (key, value = null) => {
    const x = ns.read(F);
    let j;

    try {
      j = JSON.parse(x) || {};
    } catch (e) {
      console.error(e);
      j = {};
    }

    if (value !== null) {
      const newj = {
        ...j,
        [key]: value,
      };

      ns.write(F, JSON.stringify(newj), "w");
      return newj[key];
    } else {
      return j[key];
    }
  };

  const getState = (key) => {
    const json = ns.read(F);
    try {
      if (key) {
        const full = JSON.parse(json);
        if (full[key]) {
          return full[key];
        } else {
          return "";
        }
      } else {
        return JSON.parse(json);
      }
    } catch (_e) {
      console.log(_e);
      return {};
    }
  };

  return [getState, setState];
}

/**
 * Calculate the maximum number of threads that can be run.
 *
 * Considers available RAM on the host and RAM cost of the script.
 *
 * @param {import("..").NS} ns - Bitburner Netscript API
 * @param {string} host - Hostname
 * @param {string} script - Script filename
 * @returns {number} Number of runnable threads (minimum 1)
 */
export function getThreads(ns, host, script) {
  disableLogs(ns, ["getServerMaxRam", "getServerUsedRam"]);
  const aRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
  const sRam = ns.getScriptRam(script);
  return Math.floor(aRam / sRam) || 1;
}

/**
 * Pad a string to a fixed width.
 *
 * Allows optional prefixing and left/right alignment.
 *
 * @param {string|number} str - Value to pad
 * @param {number} [pad=7] - Total width
 * @param {string} [prefix=""] - Optional prefix
 * @param {boolean} [left=true] - Left-align when true, right-align otherwise
 * @returns {string} Padded string
 */
export const pad = (str, pad = 7, prefix = "", left = true) => {
  const len = pad - `${str}`.length + prefix.length;
  const strPad = len > 0 ? new Array(len).fill(" ").join("") : "";
  return left ? `${prefix}${str}${strPad}` : `${strPad}${prefix}${str}`;
};

/**
 * Convert a formatted number string into a raw integer.
 *
 * Supports common Bitburner-style suffixes:
 * k, m, b, t, q
 *
 * @param {string|number} value - Formatted value (e.g. "1.5b")
 * @returns {number} Parsed integer value, or NaN if invalid
 */
export function fromFormat(value) {
  const multipliers = {
    "": 1,
    k: 1e3,
    m: 1e6,
    b: 1e9,
    t: 1e12,
    q: 1e15,
  };

  const str = String(value).toLowerCase().replace(/,/g, "").trim();

  const match = str.match(/^([\d.]+)\s*([kmbtq]?)$/);
  if (!match) return NaN;

  const amount = Number(match[1]);
  const suffix = match[2];

  return Math.floor(amount * multipliers[suffix]);
}

/**
 * Find the nearest lower power-of-two value.
 *
 * Decrements the input until it is a valid power of two.
 *
 * @param {number} x - Input number
 * @returns {number} Nearest lower power of two
 */
export function getPow2(x) {
  do {
    x--;
  } while (Math.log2(x) % 1 !== 0);
  return x;
}

/**
 * Simple argument parser for Netscript scripts.
 *
 * Supports `key=value` pairs, automatic type coercion,
 * required parameters, and a built-in help mode.
 *
 * @export
 * @param {import(".").NS} ns - Bitburner Netscript API
 * @param {Object} preDef - Default values (use `undefined` for required args)
 * @param {Function} helpCallback - Optional help output callback
 * @returns {Object} Parsed arguments
 */
export function getArgs(ns, preDef, helpCallback) {
  if (ns.args[0] === "help" || ns.args[0] === "-h") {
    ns.tprintRaw(`Possible Parameters: ${Object.keys(preDef).join(" | ")}`);
    if (helpCallback) {
      helpCallback();
    }
    ns.exit();
  }

  const input = ns.args;
  const args = Object.fromEntries(
    input.map((arg) => {
      const a = arg.split("=");

      if (!a[1]) {
        ns.tprintRaw(`Possible Parameters: ${Object.keys(preDef).join(" | ")}`);
        ns.exit();
      }

      if (/false/.test(a[1])) return [a[0], false];
      if (/true/.test(a[1])) return [a[0], true];
      if (/null/.test(a[1])) return [a[0], null];
      if (!isNaN(a[1])) return [a[0], parseFloat(a[1])];

      a[1] = a[1].replaceAll("+", " ");
      return a;
    })
  );

  const ret = Object.assign({}, preDef, args);

  Object.keys(ret).forEach((a) => {
    if (ret[a] === undefined) {
      ns.tprintRaw(`Possible Parameters: ${Object.keys(preDef).join(" | ")}`);
      ns.tprintRaw(`${a} is required for this script`);
      ns.exit();
    }
  });

  return ret;
}
