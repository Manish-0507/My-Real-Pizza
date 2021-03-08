require('dotenv').config();
const express = require('express');
const app = express();

const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
require('./db/db');
const session = require('express-session');
const flash = require('express-flash');//inse hum message flash kr skte h or ye hote h single request k liye.
var MongoStore = require('connect-mongo').default;
const passport = require('passport');
const emitter = require('events');//node js built in module for event emitter




//path
const viewsPath = path.join(__dirname, '/resources/views');


//event Emitter
const eventEmitter = new emitter();
app.set('eventEmitter', eventEmitter);//hmne ise apne 'app'(jisme express() h) usse bind kr diya taaki ab khi bhi use kr paayenge.

//session config this session library works as a middleware
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/myPizza' }),
    collection:'sessions',
    saveUninitialized: false,
    cookie:{maxAge:1000*60*60*24}//maximum life of a cookie.
}))



//passport config
//code bda tha to dusri file m likh k ura import kr liya utha passport chahiye tha to bhej diya.
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


//global middleware .....jo har request pr kaam krte h mtlb execute hote h.
app.use((req,res,next) => {
    res.locals.session = req.session;//bhyi globally aapin session naam ka variable m store kr diya aapna session ib aapi layout.ejs m session use kr ska ha. 
    res.locals.user = req.user;//yo aapin use kr liya layout.ejs m taaki agr user h mtlb user login h to usna register and login aali link na dikhaw.
    next();
})





//Assets (mtlb express server response deta h html response to use btana hoga ki sari cheeze kha rkhi h css,js and all so that it can include them too with html)
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));//register krte waqt url encoded data aan lag rya h us khatr bhi btani pdagi ki isna bhi handle kriye.
app.use(express.json());//cart m jo data bheja ha js t wo json m hoga to usna smjh jyaga yo ista.
app.use(flash());

//set template engine
app.use(expressLayout);
app.set('views', viewsPath);
app.set('view engine', 'ejs');


//routes
require('./routes/web')(app);
app.use((req, res) =>//middleware which will run when all routes are checked and no route is found! then it comes here.
{
    res.status(404).send(`<h1>404 PAGE NOT FOUND`);
})


const server=app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

//Socket
const io = require('socket.io')(server);//ki konsa server hme use krna h socket k liye.
io.on('connection', (socket) =>
{
    //har ek order k liye private room bnaya jaayega.
    //join the connected client
    socket.on('join', (orderId) =>//even received named join emitted from app.js with name received in brackets.bracket m jo accept krya h argument wo room ka naam h jo aaya h app.js t.
    {
        socket.join(orderId)//ye join h socket ka jissse ab hum is orderId k naame k room mr jooin ho jayenge.
    })
    
})

//receiving event emitted from statusController
eventEmitter.on('orderUpdated', (data) =>
{
    io.to(`order_${data.id}`).emit('orderUpdated', data);
})
//how this data is dynamically changing in in user tracking page.

/////////sbta pehli to ura connection bnaya thk h fer layout.ejs m socket link krya fer uska karan app.js m io available hogya.usma order pehli t available tha to utha t us id n leke ek event emit hoi  jiska naam join tha .
//wo basically ek private room tha jiska naam wa id e thior fer server.js m wa event catch kr li or fer us naam t e ura room join kr diya.hoge donu aapas m connect.  
//fer status controller m t event emit hoi change hote e data with changed data passed.fer wa event catch kr li ura server js m fer us room m io.to() krke wo e room jo join krya tha usma e event emit kr di with that updated data.fer app.js m catch kr li or order jo purana tha utha wo update kr diya nya data k saath.








