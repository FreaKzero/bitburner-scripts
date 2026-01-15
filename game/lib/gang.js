import cfg from "../etc/gang";
import { pad } from "./utils";

export function gangRecruit(ns, task) {
  while (ns.gang.canRecruitMember()) {
    var name = `${cfg.names[ns.gang.getMemberNames().length + 1]}`;
    if (!ns.gang.recruitMember(name)) {
      return;
    }
    ns.gang.setMemberTask(name, task);
  }
}

export function getMemberPower(memberInfo) {
  return Math.floor(
    (memberInfo.str + memberInfo.def + memberInfo.dex + memberInfo.agi) / 1000
  );
}
export function gangIsWanted(gangInformation) {
  return gangInformation.wantedLevel >= 0.15 

}
export function gangMemberAscend(ns, member) {
  const ascInfo = ns.gang.getAscensionResult(member);
  if (ascInfo) {
    const factor = (ascInfo.str + ascInfo.def + ascInfo.dex + ascInfo.agi) / 4;

    if (factor >= 4) {
      ns.gang.ascendMember(member);
    }

    return factor.toFixed(1);
  } else {
    return 0;
  }
}

export function gangBuy(ns, mem) {
  // 🔪 🔫 🛡️ 🚗 🦾
  var EQUIP_TYPES = ["Weapon", "Armor", "Vehicle", "Augmentation"];

  for (var equip of ns.gang.getEquipmentNames()) {
    if (
      EQUIP_TYPES.includes(ns.gang.getEquipmentType(equip)) &&
      ns.gang.getEquipmentCost(equip) < ns.getPlayer().money / 100
    ) {
      ns.gang.purchaseEquipment(mem, equip);
    }
  }
}

export function gangGetUIUpgrades({ upgrades = [], augmentations = [] }) {
  const ICONS = {
    Weapon: {
      icon: "🔫",
      match: [
        /bat/i,
        /katana/i,
        /blade/i,
        /knife/i,
        /glock/i,
        /p90/i,
        /aug/i,
        /ak/i,
        /rifle/i,
        /sniper/i,
      ],
    },
    Armor: { icon: "🛡️", match: [/armor/i, /vest/i, /plating/i] },
    Vehicle: { icon: "🚗", match: [/ford/i, /bike/i, /mercedes/i, /ferrari/i] },
    Augmentation: { icon: "🦾", match: [] },
  };

  const counts = {
    Weapon: 0,
    Armor: 0,
    Vehicle: 0,
    Augmentation: augmentations.length,
  };

  for (const up of upgrades) {
    for (const key of ["Weapon", "Armor", "Vehicle", "Augmentation"]) {
      if (ICONS[key].match.some((r) => r.test(up))) {
        counts[key]++;
        break;
      }
    }
  }

  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key, n]) => pad(`${ICONS[key]?.icon}[${n}]`, 5, ""));
}
