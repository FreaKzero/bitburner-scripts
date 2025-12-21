import { C } from "./lib/const";

/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.ui.clearTerminal();
  ns.tprint(`
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
`);
}
