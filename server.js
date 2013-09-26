var root = require('root');
var markup = require('json-markup');
var pejs = require('pejs');
var level = require('level');

var views = pejs();
var app = root();
var db = level(__dirname+'/db', {valueEncoding:'json'});

var production = process.env.NODE_ENV === 'production';
var host = production ? 'http://nodejs.walling.dk' : 'http://localhost:9999';

var doc = {
	name: 'Copenhagen Node.js Meetup',
	fork_me_on_github: 'https://github.com/walling/nodeclub-2013-10-03',
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

db.get('participants', function(err, participants) {
	if (participants) doc.participants = participants;
});

app.get('/signup', function(request, response) {
	views.render('signup.html', function(err, html) {
		if (err) return response.error(err);
		response.send(html);
	});
});

app.get('/after-signup', function(request, response) {
	var name = ('' + [request.query.name]).trim().replace(/[\0-\x1F\s]+/g, ' ');
	var uniq = {};

	if (name) doc.participants.push(name);
	doc.participants.forEach(function(name) {
		uniq[name] = true;
	});
	doc.participants = Object.keys(uniq);
	
	db.put('participants', doc.participants);
	response.redirect('/');
});

app.get(function(request, response) {
	views.render('index.html', {markup:markup(doc)}, function(err, html) {
		if (err) return response.error(err);
		response.send(html);
	});
});

app.listen(9999);
