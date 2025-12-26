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
export function state(ns, key, value=null) {
  const F = "/data/global.json";
  const x = ns.read(F);
  let j;

  try {
  	 j = JSON.parse(x) || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(_e) {
	 j = {};
  }

  if (value !== null) {
    const newj = {
      ...j,
      [key]: value
    };

    ns.write(F, JSON.stringify(newj), "w");
    return newj[key];
  } else {
    return j[key];
  }
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
