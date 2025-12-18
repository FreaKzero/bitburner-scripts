/** @param {import("..").NS } ns */
export function disableLogs(ns, array) {
  ['disableLog', ...array].forEach(str => {
    ns.disableLog(str)
  });
}

/** @param {import("..").NS } ns */
export function getThreads(ns, host, script) {
  disableLogs(ns, ['getServerMaxRam', 'getServerUsedRam']);
  const aRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
  const sRam = ns.getScriptRam(script);
  return Math.floor(aRam / sRam) || 1;
}

export const pad = (str, pad = 7, prefix = '', left = true) => {
	const len = (pad - `${str}`.length) + prefix.length;
	const strPad = len > 0 ? new Array(len).fill(' ').join('') : '';
	return left ? `${prefix}${str}${strPad}` : `${strPad}${prefix}${str}`;
}

export function fromFormat(shortFormat) {
	const fx = {
		'': 0,
		'k': 1,
		'm': 1000,
		'b': 1000000,
		't': 1000000000,
		'q': 1000000000000
	}

	const rgx = /([0-9]*)(k|m|b|t|q)/gmi
	const [full, amount, post] = rgx.exec(shortFormat.replaceAll('.', ''));

	return fx[post] * parseInt(amount);
}

export function getPow2(x) {
	do {
		x--;
	} while (Math.log2(x) % 1 !== 0);
	return x
}
