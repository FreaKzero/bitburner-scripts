import {deepscan} from '../lib/scan';

/** @param {import("..").NS } ns */
export async function main(ns) {
    const list = deepscan(ns, 'home');
    const SPECIAL = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave", "powerhouse-fitness"];
    
    const HOSTS = `export const HOSTS = ${JSON.stringify(list)}`;
    
    const speclist = list.filter(a => SPECIAL.includes(a)).map(a => {
        const s = ns.getServer(a);
        return {
            host: a,
            lvl: s.requiredHackingSkill,
            ports: s.numOpenPortsRequired,
            wait: s.requiredHackingSkill < 800 ? 4000 : 10000
        }
    });
    
    const SPECIAL_HOSTS = `export const SPECIAL_HOSTS = ${JSON.stringify(speclist)}`;

    const content = `${HOSTS};\n\n${SPECIAL_HOSTS};`;
    ns.write('../data/cache.js', content, 'w');

}

