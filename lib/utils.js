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