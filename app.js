const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Idea Service

const app = express(feathers());

//Parse JSON
app.use(express.json());
//Configure socket.io in realtime APIs
app.configure(socketio());
// Enable REST
app.configure(express.rest());
// Register Service
app.use('/ideas', new IdeaService());


// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));
// Publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.port || 3030;

app.listen(PORT).on('listening', () => console.log(`Realtime server running on port ${PORT}`));