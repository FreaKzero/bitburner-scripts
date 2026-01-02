/** @param {NS} ns */
export default class Store {
	constructor(ns, file) {
		this.FILE = file;
		this.DATA = ns.fileExists(file) ? JSON.parse(ns.read(file)) : [];
		this.NS = ns;
		this.SCHEMA = {};
		this.ONPERSIST = () => null;
		this.ERRORDELAY = 10000;
		this.CURSOR = -1
		this.PROP_ID = null;
	}

	setId(propId) {
		this.PROP_ID = propId;
	}

	genId() {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return new Array(3).fill('').map(_i => Math.random().toString(36).substring(2, 10)).join('-');
	}

	getById(id) {
		return this.DATA.find((a) => a.id === id);
	}

	onPersist(func) {
		if (typeof func === 'function') {
			this.ONPERSIST = func;
		} else {
			this.NS.toast('onPersist is not a Function', 'error', this.ERRORDELAY);
		}
	}

	setSchema(schema) {
		this.SCHEMA = schema;
	}

	persist() {
		this.NS.write(this.FILE, JSON.stringify(this.DATA), "w");
		this.CURSOR = -1;
		this.ONPERSIST();
	}

	insert(callback) {
		const newData = callback(this.SCHEMA);
		if (this.PROP_ID) {
			if (!newData[this.PROP_ID]) {
				this.NS.tprint(`${this.PROP_ID} not found in dataset`)
				return;
			}
			this.DATA.push({id: newData[this.PROP_ID], ...newData})
		} else {
			this.DATA.push({ id: this.genId(), ...newData });
		}
		return this;
	}

	findOne(callback) {
		const idx = this.DATA.findIndex(callback);
		this.CURSOR = idx;
		return this;
	}

	data() {
		if (this.CURSOR > -1) {
			return this.DATA[this.CURSOR];
		}
	}

	find(callback) {
		return this.DATA.filter(callback);
	}

	update(callback) {
		if (this.CURSOR > -1) {
			const newData = callback(this.DATA[this.CURSOR]);
			this.DATA[this.CURSOR] = newData;
			return this;
		}
	}

	upsert(callback) {
		if (this.CURSOR > -1) {
			this.update(callback);
		} else {
			this.insert(callback);
		}
		return this;
	}

	migrate() {
		if (Object.keys(this.SCHEMA).length) {
			this.DATA = this.DATA.map(oldItem => Object.assign({}, this.SCHEMA, oldItem));
			return this;
		}
	}
}