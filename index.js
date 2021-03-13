let fs = require("fs");

class Database {
	constructor(pathToDb) {
		if (!fs.existsSync(pathToDb)) {
			fs.writeFileSync(pathToDb, `{}`);
		}
		this.file = pathToDb;
		this._loadFile();
		this._startWatching();
	}
	_loadFile() {
		this._rawData = JSON.parse(fs.readFileSync(this.file));
		this._changed = false;
	}
	_startWatching() {
		setInterval(() => {
			if (this._changed) {
				fs.writeFileSync(this.file, JSON.stringify(this._rawData));
			}
		}, 5000);
	}
	get(key) {
		return this._rawData[key];
	}
	set(key, value) {
		let [oldValue] = [this._rawData[key]];
		this._rawData[key] = value;
		this._changed = true;
		return [oldValue, value];
	}
	forEach(callback) {
		Object.entries(this._rawData).forEach((entry, index) => {
			let [key, value] = entry;
			callback(key, value, index);
		});
	}
}

module.exports = Database;
