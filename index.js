// Module dependencies.
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const redisSocket = require('socket.io-redis');
const app = module.exports = express();
const redis = require('redis');
const os = require('os');
console.log(os.cpus());
app.set('port', process.env.PORT || 3000);

/***** Redis Connection ******/

let redisClient = redis.createClient();
redisClient.on('connect',function(){
    console.log('Redis connected')
});

/***** Redis Connection ******/
const server = app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});

const io_s = require('socket.io')(server);

io_s.adapter(redisSocket({
    host: 'localhost',
    port: 6379
}));

// Set namespace for socket, it's most important for load balancing.
const io = io_s.of('mynamespace');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((error, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', err);
});

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('connection call ',process.env.PORT || 3000);
    io.adapter.clients((err, clients) => {
        console.log('Port : ', process.env.PORT || 3000);
        console.log(clients); // an array containing all connected socket ids
    });
    socket.on('message-all', (data) => {
        io.emit('message-all', data);
        console.log('Port : ', process.env.PORT || 3000);
    });

    socket.on('join', (room) => {
        socket.join(room);
        io.emit('message-all', "Socket " + socket.id + " joined to room " + room);
        console.log('Port : ', process.env.PORT || 3000);
    });

    socket.on('message-room', (data) => {
        const room = data.room;
        const message = data.message;
        io.to(room).emit('message-room', data);
        console.log('Port : ', process.env.PORT || 3000);
    });


    
});

app.get('/clients', (req, res, next) => {
    console.log('Port : ', process.env.PORT || 3000);
    res.send(Object.keys(io.connected));
});

// PORT=3000 pm2 start index.js --name "3000"