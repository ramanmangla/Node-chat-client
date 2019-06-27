 
// Node Chat Client
// Server

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// MongoDB mLab credential file
var credential = require('./credential.json')

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbURL = 'mongodb+srv://' + credential.username + ':' + credential.password + 
			'@chatbotdb-pkefu.mongodb.net/test?retryWrites=true&w=majority';

var Message = mongoose.model('Message', {
	name: String,
	message: String
});

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});

app.post('/messages', (req, res) => {
	var message = new Message(req.body);

	message.save((err) => {
		if(err) {
			sendStatus(500);
		}

		io.emit('message', req.body);
		res.sendStatus(200);
	});	
});

io.on('connection', (socket) => {
	console.log('Connected');
});

mongoose.connect(dbURL, { useNewUrlParser: true }, (err) => {
	console.log('MongooDB connected', err);
});

var server = http.listen(3000, () => {
	console.log("Server is listening on port", server.address().port);
});