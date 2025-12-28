import { C } from "../lib/utils";
import { findElement, goCity } from "../lib/ui";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.clearTerminal();
  ns.killall();

  goCity('FoodNStuff');
  findElement('.MuiButtonBase-root', 'part-time employee', true);
  findElement('.MuiButtonBase-root', 'work', true);

  let O = `
  ${C.white} 🟢 Starting Contracts Daemon ...${C.reset}
  ${C.white} 🟢 Starting Netmonitor ...${C.reset}
  ${C.white} 🟢 Starting Crackshop ...${C.reset}
  ${C.red} 💣 Cracking Hosts ...${C.reset}
  `;
  
  ns.exec("bin/cracknet.js", 'home');
  ns.exec("daemon/contracts.js", "home");
  ns.exec("shop/cracks.js", "home");

  ns.tprint(O);

  await ns.sleep(3000);
  ns.exec('bin/deploy.js', 'home', 1, 'script=dist/auto.js', 'host=n00dles')

  let U = `\n${C.red} 💥 Attacking n00dles ...${C.reset}\n`;
  U += `${C.white} 🌭 Find a Job ... ${C.reset}\n`;
  U += `
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

ns.tprint(U);
ns.exec('bin/logs.js', 'home');
}
