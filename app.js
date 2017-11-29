var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '2a69f2d6-7eb0-404b-a101-dd80766be1f2',
    appPassword: 'fapWKQC|vhfbALG18288=^%'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    
    //session.send("Sorry I do not understand what %s means. Please try again.",session.message.text);
    
    //session.send("You said: %s", session.message.text);
});


luis.startDialog(bot);