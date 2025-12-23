import { C } from "../lib/const";

/** @param {import("..").NS } ns */
export async function main(ns) {
  ns.ui.clearTerminal();
  ns.killall();
  let O = `
  ${C.white} 🟢 Starting Contracts Agent ...${C.reset}
  ${C.white} 🟢 Starting Backdoors Agent ...${C.reset}
  ${C.white} 🟢 Starting Netmonitor ...${C.reset}
  ${C.red} 💣 Cracking Hosts ...${C.reset}
  `;
  
  
  ns.exec("agent/contracts.js", "home");
  ns.exec("agent/backdoor.js", "home");
  ns.exec("bin/lsnet.js", "home");
  ns.exec("bin/cracknet.js", 'home');
  ns.tprint(O);

  ns.sleep(3000);
  ns.exec('bin/distribute.js', 'home', 1, 'script=dist/auto.js', 'host=n00dles')
  const aRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
  const sRam = ns.getScriptRam("dist/auto.js", 'home');
  const threads = Math.floor(aRam / sRam);
  ns.exec("dist/auto.js", "home", threads || 1, "n00dles");

  let U = `${C.red} 💥 Attacking n00dles ...${C.reset}`;
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
