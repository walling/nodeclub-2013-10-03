var root = require('root');
var markup = require('json-markup');
var pejs = require('pejs');

var views = pejs();
var app = root();

var host = 'http://localhost:9999';

var doc = {
	name: 'Copenhagen Node.js Meetup',
	venue: 'Founders House',
	where: 'http://goo.gl/maps/FgAAc',
	location: {
		lat: 55.681783,
		lng: 12.584704
	},
	when: '2013-10-03T18:02:71.828+0200',
	keywords: [
		'lighting talks',
		'hackathon',
		'meet people'
	],
	maintainers: [
		'Mathias Buus <mathiasbuus@gmail.com>',
		'Bjarke Walling <bwp@bwp.dk>'
	],
	signup: host+'/signup',
	participants: []
};

app.get('/signup', function(request, response) {
	views.render('signup.html', function(err, html) {
		if (err) return response.error(err);
		response.send(html);
	});
});

app.get('/after-signup', function(request, response) {
	var name = request.query.name;
	doc.participants.push(name);
	response.redirect('/');
});

app.get(function(request, response) {
	views.render('index.html', {markup:markup(doc)}, function(err, html) {
		if (err) return response.error(err);
		response.send(html);
	});
});

app.listen(9999);