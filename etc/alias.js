import { execTerm } from "../lib/ui";

export function main() {

  const alias = ` 
unalias --all
alias -g fl1ght="run fl1ght.exe"
alias -g nuke="run NUKE.exebackdoor"
alias go="run bin/go.js"
alias stocks="stocks/full.js"
alias focus="run bin/focus.js"
alias boot="run bin/boot.js"
alias dir="ls"
alias logs="ps;run bin/logs.js"
alias cracknet="run bin/cracknet.js"
alias deploy="run bin/deploy.js"
alias thread="run bin/thread.js;ps"
alias lsnet="run bin/lsnet.js"
alias conn="run bin/conn.js"
`;
const normalized = alias
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .join(';')

execTerm(normalized);
}
