import { C } from "../lib/utils";
import cfg from "../etc/sys";
//import { goCity, findElement, reactClickButton } from "../lib/ui";


// TODO remove inject use autoexec

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.ui.clearTerminal();
  ns.killall();
  await ns.sleep(1000);

  const h = "home";

  for (const b of cfg.boot) {
    ns.tprint(`🟢 Starting ${b.title} ...`);
    ns.exec(b.script, h, 1, ...b.args);
    await ns.sleep(2000);
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

await ns.sleep(500);

ns.print(LOGO);
/* 
if (ns.getPlayer().skills.hacking < 15) {
    goCity("foodnstuff");
    await ns.sleep(500);
    reactClickButton("Apply to be a Part-time Employee");
    reactClickButton("Work");
    await ns.sleep(500);
    findElement("button", "Focus", true);
  } */
}
