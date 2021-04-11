const Model = require('./Model');
const PokemonException = require('../exceptions/PokemonException');
const DatabaseException = require('../exceptions/DatabaseException');

class Pokemon extends Model {
	static async create(name, type) {
		const connection = await Model.connect();
		const sql = 'INSERT INTO `pokemon` (`name`, `type`) VALUES (?, ?)';
		let results;

		try {
			[results] = await connection.execute(sql, [name, type]);
		}
		catch (exception) {
			throw new DatabaseException(exception);
		}
		finally {
			await connection.end();
		}

		if (!results) {
			throw new PokemonException();
		}

		const id = results.insertId;

		return new Pokemon()
			.setId(id)
			.setName(name)
			.setType(type);
	}

	static async findAll() {
		const connection = await Model.connect();
		const sql = 'SELECT * FROM `pokemon`';
		let results;

		try {
			[results] = await connection.execute(sql);
		}
		catch (exception) {
			throw new DatabaseException(exception);
		}
		finally {
			await connection.end();
		}

		return results.map((row) => new Pokemon()
			.setId(row.id)
			.setName(row.name)
			.setType(row.type));
	}

	static async findById(id) {
		const connection = await Model.connect();
		const sql = 'SELECT * FROM `pokemon` WHERE `id` = ?';
		let results;

		try {
			[results] = await connection.execute(sql, [id]);
		}
		catch (exception) {
			throw new DatabaseException(exception);
		}
		finally {
			await connection.end();
		}

		if (results.length === 0) {
			return null;
		}

		return new Pokemon()
			.setId(results[0].id)
			.setName(results[0].name)
			.setType(results[0].type);
	}

	static async findByName(name) {
		const connection = await Model.connect();
		const sql = 'SELECT * FROM `pokemon` WHERE `name` = ?';
		let results;

		try {
			[results] = await connection.execute(sql, [name]);
		}
		catch (exception) {
			throw new DatabaseException(exception);
		}
		finally {
			await connection.end();
		}

		if (results.length === 0) {
			return null;
		}

		return new Pokemon()
			.setId(results[0].id)
			.setName(results[0].name)
			.setType(results[0].type);
	}

	async save() {
		const connection = await Model.connect();
		const sql = 'UPDATE `pokemon` SET `name` = ?, `type` = ? WHERE id = ?';

		let results;

		try {
			[results] = await connection.execute(sql, [this.name, this.type, this.id]);
		}
		catch (exception) {
			throw new DatabaseException(exception);
		}
		finally {
			await connection.end();
		}

		return results.affectedRows === 1;
	}

	async remove() {
		const connection = await Model.connect();
		const sql = 'DELETE FROM `pokemon` WHERE `id` = ?';
		let results;

		try {
			[results] = await connection.execute(sql, [this.id]);
		}
		catch (exception) {
			throw new DatabaseException(exception);
		}
		finally {
			await connection.end();
		}

		return results.affectedRows === 1;
	}

	getName() {
		return this.name;
	}

	getType() {
		return this.type;
	}

	setName(name) {
		this.name = name;
		return this;
	}

	setType(type) {
		this.type = type;
		return this;
	}
}

module.exports = Pokemon;
