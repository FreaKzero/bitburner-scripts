import { disableLogs } from "./utils";
/** @param {import("../").NS } ns */
export function deepscan(ns, rootHost = "home") {
  disableLogs(ns, ['sleep', 'scan']);
  let pendingScan = [rootHost];
  const list = new Set(pendingScan);

  while (pendingScan.length) {
    const hostname = pendingScan.shift();
    list.add(hostname);

    pendingScan.push(...ns.scan(hostname));
    pendingScan = pendingScan.filter((host) => !list.has(host));
  }

  return [...list];
}

/** @param {import("../").NS } ns */
export function findConnection(ns, target, rootHost = "home") {
  const queue = [rootHost];
  const visited = new Set([rootHost]);
  const parent = {}; 

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === target) break;

    for (const neighbor of ns.scan(current)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }

  if (!visited.has(target)) return null;

  const path = [];
  let node = target;

  while (node !== rootHost) {
    path.push(node);
    node = parent[node];
  }

  path.reverse(); 

  return path;
}


