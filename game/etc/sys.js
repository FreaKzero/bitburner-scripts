export default {
  contractCheckInterval:300000,
  prefixServer: "frk-server-",
  prefixHacknet: "hacknet-node-",
  boot: 
  [
    { title: "Inject Styles", script: "sys/inject.js", args:[], order: 1},
    { title: "Register Aliases", script: "etc/alias.js", args: [], order: 1 },
    { title: "Monitor", script: "bin/psx.jsx", args: ["sort=time"], order: 3 },
    { title: "Contracts Daemon", script: "daemon/contracts.js", args: [], order: 4 },
    { title: "Cracknet", script: "bin/cracknet.js", args: [], order: 5 },
    { title: "Deploment", script: "bin/deploy.js", args: ["dist/auto.js", "n00dles"], order: 6},
    { title: "Crack Shop Daemon", script: "daemon/crack.js", args:[], order: 7},
    { title: "Backdoor Daemon", script: "daemon/backdoor.js", args:[], order: 8},
    { title: "Network Monitor", script: "bin/lsnet.js", args:[], order: 9},
    { title: "Threaded Attack", script: "bin/thread.js", args: ['dist/auto.js', 'n00dles', '80'], order: 98}, 
    { title: "Building Cache", script: "sys/buildcache.js", args: [], order: 0 },   
  ].sort((a, b) => a.order - b.order),
  dist: [
    "dist/auto.js",
    "dist/share.js",
    "dist/hack.js",
    "dist/grow.js",
    "dist/weak.js",
  ],
};
 