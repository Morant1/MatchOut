const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const cors = require('cors');


const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}
// Express App Config
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use(session({
    secret: 'puki muki secret stuff',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

const authRoutes = require('./api/auth/auth.routes')
const eventiRoutes = require('./api/eventi/eventi.routes')
const userRoutes = require('./api/user/user.routes')
const connectSockets = require('./api/socket/socket.routes')

//routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/eventi', eventiRoutes)
connectSockets(io)

app.get('/**', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
});



