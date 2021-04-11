const Controller = require('./Controller');
const Pokemon = require('../models/Pokemon');
const PokemonException = require('../exceptions/PokemonException');
const HttpStatusCode = require('../helpers/HttpStatusCode');

class PokemonController extends Controller {
	constructor(request, response, session) {
		super(request, response, session);

		const headerParameters = this.request.getParameters().header;

		switch (request.getRequestMethod()) {
			case 'GET':
				if (headerParameters.length === 0) {
					this.setAction(this.list);
				}
				else if (headerParameters[0] === 'new') {
					this.setAction(this.getNewForm);
				}
				else if (headerParameters[1] === 'edit') {
					this.setAction(this.getEditForm);
				}
				else {
					this.setAction(this.show);
				}
				break;
			case 'POST':
				this.setAction(this.new);
				break;
			case 'PUT':
				this.setAction(this.edit);
				break;
			case 'DELETE':
				this.setAction(this.destroy);
				break;
			default:
				this.setAction(this.error);
				this.response.setResponse({
					template: 'ErrorView',
					statusCode: HttpStatusCode.METHOD_NOT_ALLOWED,
					message: 'Invalid request method!',
				});
		}
	}

	async getNewForm() {
		return this.response.setResponse({
			template: 'Pokemon/NewFormView',
			title: 'New Pokemon',
		});
	}

	async getEditForm() {
		const id = this.request.getParameters().header[0];
		const user = await Pokemon.findById(id);

		if (!user) {
			throw new PokemonException(`Cannot retrieve Pokemon: Pokemon does not exist with ID ${id}.`);
		}

		return this.response.setResponse({
			template: 'Pokemon/EditFormView',
			title: 'Edit Pokemon',
			payload: user,
		});
	}

	async new() {
		const { name, type } = this.request.getParameters().body;
		const pokemon = await Pokemon.create(name, type);

		return this.response.setResponse({
			redirect: `pokemon/${pokemon.getId()}`,
			message: 'Pokemon created successfully!',
			payload: pokemon,
		});
	}

	async list() {
		const pokemon = await Pokemon.findAll();

		return this.response.setResponse({
			template: 'Pokemon/ListView',
			message: 'Pokemon retrieved successfully!',
			payload: pokemon,
		});
	}

	async show() {
		const id = this.request.getParameters().header[0];
		const pokemon = await Pokemon.findById(id);

		if (!pokemon) {
			throw new PokemonException(`Cannot retrieve Pokemon: Pokemon does not exist with ID ${id}.`);
		}

		return this.response.setResponse({
			template: 'Pokemon/ShowView',
			title: pokemon.getName(),
			message: 'Pokemon retrieved successfully!',
			payload: pokemon,
		});
	}

	async edit() {
		const id = this.request.getParameters().header[0];

		const pokemon = await Pokemon.findById(id);

		if (!pokemon) {
			throw new PokemonException(`Cannot update Pokemon: Pokemon does not exist with ID ${id}.`);
		}

		const fieldsEdited = this.editModelFields(pokemon, ['name', 'type']);

		if (fieldsEdited === 0) {
			throw new PokemonException('Cannot update Pokemon: No update parameters were provided.');
		}

		if (!(await pokemon.save())) {
			throw new PokemonException('Cannot update Pokemon.');
		}

		return this.response.setResponse({
			redirect: `pokemon/${pokemon.getId()}`,
			message: 'Pokemon updated successfully!',
			payload: pokemon,
		});
	}

	async destroy() {
		const id = this.request.getParameters().header[0];
		const pokemon = await Pokemon.findById(id);

		if (!pokemon) {
			throw new PokemonException(`Cannot delete Pokemon: Pokemon does not exist with ID ${id}.`);
		}

		if (!(await pokemon.remove())) {
			throw new PokemonException('Cannot delete Pokemon.');
		}

		return this.response.setResponse({
			redirect: 'pokemon',
			message: 'Pokemon deleted successfully!',
			payload: pokemon,
		});
	}
}

module.exports = PokemonController;
