import {goCity, goLocation, goTravel} from '../lib/ui';

/** @param {import("..").NS } ns */
export async function main(ns) {
    const i = ns.args[0]?.trim() || undefined;
    if (i === 'map') {
        goCity('just go anywhere');
    }

    if (!i) {
        ns.tprintRaw(`
go map: 
\t Opens the Citymap 

Locations:
\tT  Technician
\tG  Gym
\tU  University
\tS  Slums
\t$  Stock Market 
\tH  Hospital

Cities:
\tVolharen
\tSector-12
\tNew Tokyo
\tAevum
\tIshima
`);
        return;
    }

    if (i.length === 1) {
        if (["T","G","U","S","$"].includes(i.toUpperCase())) {
            goLocation(i.toUpperCase()) 
        } else {
            ns.tprintRaw(`${i} is not a valid Location`);
        }
        
        return
    }

    if (["Volharen","Sector-12","New Tokyo","Aevum","Ishima"].includes(i)){
        goTravel(i);
    }

    goCity(i);

}