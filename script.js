
// Establishing two way connection with socket instance
var socket = io();
socket.on('message', addMessage);

// Starts when DOM has been loaded
$(() => {
	// Event listener for Submit button
    $("#send").click(()=>{
        var message = {name: $('#name').val(), message: $('#message').val()};

        postMessage(message);
    });

    getMessages();
});

// Add a message to the chat client window
function addMessage(message){
    $("#messages").append(`<div class = "message"><h4> ${message.name} </h4> <p> ${message.message} </p></div>`);
}

// Get messages from database and populate the chat client
function getMessages() {
	$.get('http://localhost:3000/messages', (data) => {
		data.forEach(addMessage);
	});
}

// Post a message to the server
function postMessage(message) {
	$.post('http://localhost:3000/messages', message);
}
