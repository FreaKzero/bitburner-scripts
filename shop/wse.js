import { findElement, goLocation, goSidebar } from "../lib/ui";

export async function main() {
    goLocation('$');
    findElement('.MuiButtonBase-root', 'WSE Account', true);
    goSidebar('Terminal');
}