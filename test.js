import { findElement, goMap, goSidebar } from "./lib/ui";


/** @param {import(".").NS } ns */
export async function main(ns) {
    const terminalInput = document.getElementById("terminal-input");
terminalInput.value = "deine mudda";
            
const handler = Object.keys(terminalInput)[1];
terminalInput[handler].onChange({target:terminalInput});

 const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: false,
        key: 'Enter',
    });

      terminalInput.dispatchEvent(enterEvent);

}


