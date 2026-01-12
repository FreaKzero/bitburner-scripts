import { C, getArgs, pad, setupTail } from "../lib/utils.js";

class GoPlayer {
  constructor(ns, size, logMoves = false) {
    this.NS = ns;
    this.size = size;
    this.logMoves = logMoves;

    // Register all tactics in one place
    this.tactics = [
      ["Capture", () => this.tacticCapture()],
      ["Defend", () => this.tacticDefend()],
      ["Atari", () => this.tacticAtari()],
      ["Connect", () => this.tacticConnect()],
      ["Expand", () => this.tacticExpand()],
      ["Fallback", () => this.tacticFallback()],
    ];
  }

  convert(board) {
    return board.map((r) => [...r]);
  }

  /* ===============================
	   BASIC HELPERS
	================================ */
  getAdjacent(x, y) {
    const res = [];
    if (x > 0) res.push([x - 1, y]);
    if (x < this.size - 1) res.push([x + 1, y]);
    if (y > 0) res.push([x, y - 1]);
    if (y < this.size - 1) res.push([x, y + 1]);
    return res;
  }

  isValidMove(x, y) {
    return this.NS.go.analysis.getValidMoves()[x][y] === true;
  }

  isSafeMove(x, y) {
    if (!this.isValidMove(x, y)) return false;

    const board = this.convert(this.NS.go.getBoardState());
    const liberties = this.NS.go.analysis.getLiberties();

    let newLiberties = 0;

    for (const [nx, ny] of this.getAdjacent(x, y)) {
      if (board[nx][ny] === ".") newLiberties++;
      if (board[nx][ny] === "X" && liberties[nx][ny] > 1) {
        return true;
      }
    }

    if (newLiberties === 1) {
      for (const [nx, ny] of this.getAdjacent(x, y)) {
        if (board[nx][ny] === "O" && liberties[nx][ny] === 1) {
          return true;
        }
      }
      return false;
    }

    return newLiberties >= 2;
  }

  /* ===============================
	   TACTICS
	================================ */

  tacticCapture() {
    const board = this.convert(this.NS.go.getBoardState());
    const liberties = this.NS.go.analysis.getLiberties();

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (board[x][y] !== "O" || liberties[x][y] !== 1) continue;
        for (const [nx, ny] of this.getAdjacent(x, y)) {
          if (this.isValidMove(nx, ny)) return [nx, ny];
        }
      }
    }
    return null;
  }

  tacticDefend() {
    const board = this.convert(this.NS.go.getBoardState());
    const liberties = this.NS.go.analysis.getLiberties();

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (board[x][y] !== "X" || liberties[x][y] !== 1) continue;
        for (const [nx, ny] of this.getAdjacent(x, y)) {
          if (this.isSafeMove(nx, ny)) return [nx, ny];
        }
      }
    }
    return null;
  }

  tacticAtari() {
    const board = this.convert(this.NS.go.getBoardState());
    const liberties = this.NS.go.analysis.getLiberties();

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (board[x][y] !== "O" || liberties[x][y] !== 2) continue;
        for (const [nx, ny] of this.getAdjacent(x, y)) {
          if (this.isSafeMove(nx, ny)) return [nx, ny];
        }
      }
    }
    return null;
  }

  tacticConnect() {
    const board = this.convert(this.NS.go.getBoardState());
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (!this.isSafeMove(x, y)) continue;
        let friendly = 0;
        for (const [nx, ny] of this.getAdjacent(x, y)) {
          if (board[nx][ny] === "X") friendly++;
        }
        if (friendly >= 2) return [x, y];
      }
    }
    return null;
  }

  tacticExpand() {
    const board = this.convert(this.NS.go.getBoardState());
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (!this.isValidMove(x, y)) continue;
        for (const [nx, ny] of this.getAdjacent(x, y)) {
          if (board[nx][ny] === "X") return [x, y];
        }
      }
    }
    return null;
  }

  tacticFallback() {
    const valid = this.NS.go.analysis.getValidMoves();
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (valid[x][y]) return [x, y];
      }
    }
    return null;
  }

  /* ===============================
	   MOVE ORCHESTRATOR
	================================ */
  play() {
    for (const [name, tactic] of this.tactics) {
      const move = tactic();
      if (move) {
        if (this.logMoves) this.NS.print(`Using Tactic: ${name} -> [${move}]`);
        return move;
      }
    }
    return null;
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const { enemy, size } = getArgs(ns, { enemy: null, size: null });

  const ENEMY =
    enemy ||
    (await ns.prompt("Select Enemy", {
      type: "select",
      choices: [
        "Netburners | Hacknet %",
        "Slum Snakes | Crimesuccess %",
        "The Black Hand | Hacking Money",
        "Tetrads | Stats Experience",
        "Daedalus | Reputation Gain",
        "Illuminati | Faster hack funcs",
      ],
    }));
  const SIZE =
    size ||
    (await ns.prompt("Select Boardsize", {
      type: "select",
      choices: [5, 7, 9, 13],
    }));

  if (!ENEMY || !SIZE) ns.exit();

  ns.disableLog("ALL");

  setupTail(ns, {
    title: `🎲 GOBOT v1.2 [${ENEMY.split("|")[0].trim()}]`,
    w: 500,
    h: 200,
    x: 1641,
    y: 325,
  });

  const Go = new GoPlayer(ns, SIZE, true);
  ns.go.resetBoardState(ENEMY.split("|")[0].trim(), SIZE);

  const CUR = [
    `${C.yellow}|${C.reset}`,
    `${C.yellow}/${C.reset}`,
    `${C.yellow}-${C.reset}`,
    `${C.yellow}\\${C.reset}`,
  ];
  let c = 0;

  while (true) {
    try {
      const move = Go.play();
      const res = move ? await ns.go.makeMove(...move) : await ns.go.passTurn();

      if (res.type === "gameOver")
        ns.go.resetBoardState(ENEMY.split("|")[0].trim(), SIZE);
    } catch {
      ns.go.resetBoardState(ENEMY.split("|")[0].trim(), SIZE);
    }

    ns.clearLog();
    const stats = ns.go.analysis.getStats();
    const stat = stats[ENEMY.split("|")[0].trim()];
    if (stat) {
      ns.print(`WON \t [${CUR[c <= 3 ? c++ : (c = 0)]}]\t LOST`);
      ns.print(
        `\u001b[33m${pad(stat.wins, 6, "")}\u001b[0m\t       \u001b[33m${pad(
          stat.losses,
          6,
          "",
          false
        )}\u001b[0m`
      );
      ns.print(
        `\n${stat.bonusDescription}\n\u001b[33m${ns.formatPercent(
          stat.bonusPercent / 100
        )}\u001b[0m`
      );
    } else {
      ns.print(`First Match with ${ENEMY}`);
    }
  }
}
