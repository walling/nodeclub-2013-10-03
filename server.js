var root = require('root');
var markup = require('json-markup');
var pejs = require('pejs');

var views = pejs();
var app = root();

var doc = {
	name: 'Copenhagen Node.js Meetup',
	location: {
		lat: 42.4242424,
		lng: 24.4242424
	},
	maintainers: [
		'Mathias Buus <mathiasbuus@gmail.com>',
		'Bjarke Walling <bwp@bwp.dk>'
	],
	when: new Date().toISOString(),
	participants: []
};

app.get(function(request, response) {
	views.render('index.html', {markup:markup(doc)}, function(err, html) {
		if (err) return response.error(err);
		response.send(html);
	});
});

app.listen(9999);