import { findElement, goLocation, goSidebar } from "../lib/ui";

export async function main() {
goLocation('T');
findElement('.MuiButtonBase-root', 'TOR router', true);
goSidebar('Terminal');
}


