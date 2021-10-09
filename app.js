const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Idea Service
class IdeaService {
    constructor() {
        this.ideas = [];
    }

    async find() {
        return this.ideas;
    }

    async create(data) {
        const idea = {
            id: Date.now().toString(),
            text: data.text,
            tech: data.tech,
            viewer: data.viewer,
        }

        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea);
        return idea;
    }
}

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


//Test data

app.service('ideas').create({
    text: 'Pizza Online store',
    tech: 'Node.js',
    viewer: 'Amir Mustafa'
});
