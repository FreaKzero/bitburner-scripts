export default {
  contractCheckInterval:300000,
  prefixServer: "frk-server-",
  prefixHacknet: "hacknet-node-",
  boot: 
  [
    { title: "Building Cache", script: "bin/buildcache.js", args: [], order: 0 },
    { title: "Monitor", script: "bin/psx.js", args: [], order: 1 },
    { title: "Contracts Daemon", script: "daemon/contracts.js", args: [], order: 2 },
    { title: "Cracknet", script: "bin/cracknet.js", args: [], order: 3 },
    { title: "Deploment", script: "bin/deploy.js", args: ["dist/auto.js", "n00dles"], order: 4},
    { title: "Crack Shop Daemon", script: "daemon/crack.js", args:[], order: 5},
    { title: "Backdoor Daemon", script: "daemon/backdoor.js", args:[], order: 6},
    { title: "Network Monitor", script: "bin/lsnet.js", args:[], order: 7},
    { title: "Threaded Attack", script: "bin/thread.js", args: ['dist/auto.js', 'n00dles', '80'], order: 98},    
  ].sort((a, b) => a.order - b.order),
  dist: [
    "dist/auto.js",
    "dist/share.js",
    "dist/hack.js",
    "dist/grow.js",
    "dist/weak.js",
  ],
};
