import {execTerm, save} from '../lib/ui';
 
/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.tprint('Shutting down... Please wait');
  ns.killall();
  execTerm('thread dist/auto.js crush-fitness 80')
  save();
  await ns.sleep(5000);
  ns.ui.clearTerminal();
  ns.tprintRaw('🛌🏼 Shutdown complete');

}