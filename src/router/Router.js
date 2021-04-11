const PokemonController = require('../controllers/PokemonController');
const HomeController = require('../controllers/HomeController');
const ErrorController = require('../controllers/ErrorController');
const logger = require('../helpers/Logger');

class Router {
	constructor(request, response, session) {
		this.request = request;
		this.response = response;
		this.session = session;
		this.setController(this.request.getControllerName());
	}

	getController() {
		return this.controller;
	}

	setController(controllerName) {
		const controllers = {
			PokemonController,
			HomeController,
			ErrorController,
		};
		let controller = controllerName === '' ? 'Home' : controllerName;

		controller = `${controller.charAt(0).toUpperCase() + controller.slice(1)}Controller`;

		if (!Object.keys(controllers).includes(controller)) {
			controller = 'ErrorController';
		}

		this.controller = new controllers[controller](this.request, this.response, this.session);
	}

	async dispatch() {
		try {
			this.response = await this.controller.doAction();
		}
		catch (error) {
			logger.error(error);

			this.response = await this.response.setResponse({
				template: 'ErrorView',
				title: 'Error',
				statusCode: error.statusCode,
				message: error.message,
			});
		}

		return this.response;
	}
}

module.exports = Router;
