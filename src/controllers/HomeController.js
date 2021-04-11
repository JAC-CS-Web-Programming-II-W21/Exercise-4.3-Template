const Controller = require('./Controller');

class HomeController extends Controller {
	constructor(request, response, session) {
		super(request, response, session);
		this.setAction(this.home);
	}

	async home() {
		return this.response.setResponse({
			template: 'HomeView',
			title: 'Welcome',
			message: 'Homepage!',
		});
	}
}

module.exports = HomeController;
