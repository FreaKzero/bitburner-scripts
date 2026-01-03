import { execTerm } from "../lib/ui";

export function main(ns) {

  let bin =  ns.ls('home', 'bin/');
    bin = bin.map(a => {
        const cmd = a.match(/([^\\/]+)(?=\.[^.]+$)/)?.[1]
        return `alias ${cmd}="${a}"`;
    }).join('\n');

const alias = `
unalias --all
${bin}
alias -g fl1ght="run fl1ght.exe"
alias -g nuke="run NUKE.exe;backdoor"
alias stocks="stocks/full.js"
alias dir="ls"
alias share="run bin/thread.js dist/share.js home"
`;
const normalized = alias
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .join(';')

execTerm(normalized);
}
