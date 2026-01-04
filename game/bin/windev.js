import { $ } from "../lib/ui";
import { line } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {
    const namehook = '↖ DEVELOPMENT';
    ns.ui.openTail();
    ns.ui.setTailTitle(namehook);
     ns.ui.resizeTail(500, 200);
    ns.disableLog('ALL');
    while(true) {
        ns.clearLog();        
        const dragWindows = $('.drag > h6');
        if (dragWindows) {
            const match = dragWindows.filter((w) => w.textContent.includes(namehook));
           
            if (match[0]) {
                const e = match[0].parentNode.parentNode.getClientRects()[0];
                const chars = Math.floor(e.width / 9.65);
                const pos = {
                    title: `${chars} Chars fullwidth`,
                    w: Math.floor(e.width),
                    h: Math.floor(e.height),
                    x: Math.floor(e.x),
                    y: Math.floor(e.y),
                }
            
                ns.print(line(chars));
                ns.print(`
const ln = line(${chars}, 'white');
setupTail(ns,${JSON.stringify(pos, null, 2)});`);
            }
        }
        await ns.sleep(3000);
        
    }
}

//200w = 20chars

 