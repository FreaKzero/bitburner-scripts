/**
 * Helper for Tailsetup - best use with windev command
 *
 * @export
 * @param {*} ns
 * @param {{ w: number; h: number; x: number; y: number; }} [opt={}}]
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

export function dev(ns, p) {
  const x = JSON.stringify(p, null, 2);
  ns.tprint(`/*\n${x}\n*/`);
  ns.print(`/*\n${x}\n*/`);
  console.log(x);
}
/**
 * Returns a progressbar and info for RAM usage
 *
 * @export
 * @param {import("..").NS } ns
 * @param {string} [host="home"]
 * @returns {{ progress: string; info: string; percent: string; }}
 */

export function getRamBar(ns, host = "home") {
  const all = ns.getServerMaxRam(host);
  const used = ns.getServerUsedRam(host);

  const per = Math.ceil((100 * used) / all);
  const ui = Math.ceil(per / 5) * 5;

  const col = per < 50 ? C.green : per < 75 ? C.yellow : C.red;

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
 * Multi word replacer
 *
 * @param {string} str -
 * @param {{search: replace}} mapObj -
 *
 * @returns {string} replaced string
 */
export function replaceAll(str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

  return str.replace(re, function (matched) {
    return mapObj[matched.toLowerCase()];
  });
}

/**
 * Creates a Line
 *
 * @param {number} [ln=90]
 * @param {"black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "brightBlack" | "brightRed" | "brightGreen" | "brightYellow" | "brightBlue" | "brightMagenta" | "brightCyan" | "brightWhite" | "reset"} [color=null]
 * @param {string} [what="="]
 * @returns {string}
 */
export const line = (ln = 90, color = null, what = "=") => {
  const line = new Array(ln).fill(what).join("");
  if (color) {
    return `${C[color]}${line}`;
  }
  return line;
};

/** @param {import("..").NS } ns */
export function disableLogs(ns, array) {
  ["disableLog", ...array].forEach((str) => {
    ns.disableLog(str);
  });
}

/**
 * Description of method.
 *
 * @param {import("..").NS } ns
 * @param {string} key -
 * @param {any} value -
 *
 * @returns {any} - This function does not return a value but performs assertions on the input data.
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

/** @param {import("..").NS } ns */
export function getThreads(ns, host, script) {
  disableLogs(ns, ["getServerMaxRam", "getServerUsedRam"]);
  const aRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
  const sRam = ns.getScriptRam(script);
  return Math.floor(aRam / sRam) || 1;
}

export const pad = (str, pad = 7, prefix = "", left = true) => {
  const len = pad - `${str}`.length + prefix.length;
  const strPad = len > 0 ? new Array(len).fill(" ").join("") : "";
  return left ? `${prefix}${str}${strPad}` : `${strPad}${prefix}${str}`;
};

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

export function getPow2(x) {
  do {
    x--;
  } while (Math.log2(x) % 1 !== 0);
  return x;
}

/**
 * Argument Parser
 *
 * @param {import(".").NS } ns -
 * @param {Object} preDef  default values, use undefined for required
 * @param {Function} helpCallback - Callback Function for Help Texts
 *
 * @returns {any} - This function does not return a value but performs assertions on the input data.
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

      if (/false/.test(a[1])) {
        return [a[0], false];
      }

      if (/true/.test(a[1])) {
        return [a[0], true];
      }

      if (/null/.test(a[1])) {
        return [a[0], null];
      }

      if (!isNaN(a[1])) {
        return [a[0], parseFloat(a[1])];
      }

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
