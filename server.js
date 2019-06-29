 
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

// Using ES6 promise library for Mongoose
mongoose.Promise = Promise;

// MongoDB data model
var Message = mongoose.model('Message', {
	name: String,
	message: String
});

// GET messages endpoint
app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});

// GET messages for a user
app.get('/messages/:user', (req, res) => {
	var user = req.params.user;

	Message.find({name: user}, (err, messages) => {
		res.send(messages);
	});
});

// POST messages endpoint
app.post('/messages', async (req, res) => {

	// Using async/await for enhanced callback
	// readability instead of promise chains
	// Looks more like synchronous functions
	try {
		var message = new Message(req.body);

		var savedMessage = await message.save();

		console.log('saved');

		var censored = await Message.findOne({message: 'badword'});

		if(censored) {
			await Message.remove({_id: censored.id});
		} else {
			io.emit('message', req.body);
		}

		res.sendStatus(200);
	} catch(error) {
		res.sendStatus(500);
		console.error(error);
	} finally {
		// Always executes regardless of error
		console.log('message post called')
	}

	// // Using promises and dependency chains
	// // to simplify callbacks
	// // catch block deals with any errors
	// message.save().then(() => {
	// 	console.log('saved');

	// 	// Looking for censored words
	// 	return Message.findOne({message: 'badword'});
	// }).then((censored) => {
	// 	if(censored) {
	// 		console.log('censored word found', censored);
	// 		return Message.remove({_id: censored.id});
	// 	}

	// 	// Send the the new message to all clients
	// 	// using the socket connection
	// 	io.emit('message', req.body);
	// 	res.sendStatus(200);
	// }).catch((err) => {
	// 	res.sendStatus(500);
	// 	console.error(error);
	// });	
});

// Establish socket connection
io.on('connection', (socket) => {
	console.log('Connected');
});

// Establish MongoDB connection
mongoose.connect(dbURL, { useNewUrlParser: true }, (err) => {
	console.log('MongooDB connected', err);
});

// Server listening on port 3000
var server = http.listen(3000, () => {
	console.log("Server is listening on port", server.address().port);
});