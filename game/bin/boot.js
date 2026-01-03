import { C, reactClickButton } from "../lib/utils";
import cfg from "../etc/sys";
import {goCity, findElement} from '../etc/ui';

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const doc = eval("document");
  const bod = doc.getElementById('root');
  bod.style.backgroundImage="url(https://wallpapercave.com/wp/wp9142491.jpg)";
  bod.style.backgroundSize="contain";
  doc.querySelectorAll('[class*="input"]')[0].style.backgroundColor = 'transparent';

  ns.ui.clearTerminal();
  ns.killall();
  await ns.sleep(1000);

  const h = "home";

  for (const b of cfg.boot) {
    ns.tprint(`🟢 Starting ${b.title} ...`);
    ns.exec(b.script, h, 1, ...b.args);
    await ns.sleep(1000);
  }

  const LOGO = `
       .@@@@@@@@@@@@@@@@@.   
         .@@@@@@@@@@@@@.            
           .@@@@@@@@@.           
           %@@@@@@@@@%           
        .@@           @@.          
       %@   ${C.yellow}.@@@@@@@.${C.reset}   @%       
      %@    ${C.yellow}@@@@@@@@@${C.reset}    @%          ${C.red}--------------------------${C.reset}
    .@@-    ${C.yellow}@@@@@@@@@${C.reset}    -@@.        ${C.red}|  Boot v1.1             |${C.reset}
   .@@@:    ${C.yellow}#@@@@@@@#${C.reset}    :@@@.       ${C.red}|  Booting Process Done  |${C.reset}
    .@@-    ${C.yellow}% . @ . %${C.reset}    -@@.        ${C.red}|  Welcome Master        |${C.reset}
      %@=   ${C.yellow}+@@% %@@+${C.reset}   =@%          ${C.red}--------------------------${C.reset}
       %@-    ${C.yellow}+@@@+${C.reset}    -@%       
         %@@          @@%         
          %@@@@@@@@@@@%           
           +@@@@@@@@@@+                    
            @@@@@@@@@@                     
            @@@@@@@@@@            
            @@@@@@@@@@            
            @@@@@@@@@@            
           .@@@@@@@@@@.            
          .@@@@@@@@@@@@.           
        .@@@@@@@@@@@@@@@@. 
`;

  ns.tprint(LOGO);
  goCity('foodnstuff');
  reactClickButton('Apply to be a Part-time Employee');
  await ns.sleep(500);
  reactClickButton('Work');
  await ns.sleep(500);
  findElement('button', 'Focus', true);
  
}
