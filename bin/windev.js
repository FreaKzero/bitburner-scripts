import { line } from "../lib/utils";

/** @param {import("..").NS } ns */
export async function main(ns) {

    const w = ns.args[0] || 450;
    const h = ns.args[1] || 250;

    ns.ui.openTail();
    ns.ui.setTailTitle('DEVELOPMENT');
    ns.ui.resizeTail(w, h);
    ns.ui.moveTail(392, 563);
    ns.atExit(() => {
        ns.ui.closeTail();
    })
    ns.disableLog('ALL');
    while(true) {
        ns.clearLog();
        const doc = eval('document');
        const dragWindows = [...doc.querySelectorAll('.drag > h6')];
        if (dragWindows) {
            const match = dragWindows.filter((w) => w.textContent.includes('DEVELOPMENT'));
           
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
setupTail(ns,${JSON.stringify(pos, null, 2)});`);
            }
        }
        await ns.sleep(3000);
        
    }
}

//200w = 20chars

 