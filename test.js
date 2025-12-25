import Store from './lib/store';

/** @param {import(".").NS } ns */
export async function main(ns) {
const wat = new Store(ns, 'data/wat.json');

wat.setSchema({
    test: 0,
    test2: ''
});

wat.insert(() => {
    return {
        test: 30,
        test2: 'teststring'
    }
})

wat.insert(() => ({ test2: 'test2'}));
}