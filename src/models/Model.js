const Database = require('../database/Database');

class Model {
	static connect() {
		return Database.connect();
	}

	getId() {
		return this.id;
	}

	setId(id) {
		this.id = id;
		return this;
	}
}

module.exports = Model;
