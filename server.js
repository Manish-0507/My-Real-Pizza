require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
require('./db/db');
const session = require('express-session');
const flash = require('express-flash');
var MongoStore  = require('connect-mongo').default;



//path
const viewsPath = path.join(__dirname, '/resources/views');


//session config this session library works as a middleware
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/myPizza' }),
    collection:'sessions',
    saveUninitialized: false,
    cookie:{maxAge:1000*60*60*24}//maximum life of a cookie.
}))
app.use(flash());







//Assets (mtlb express server response deta h html response to use btana hoga ki sari cheeze kha rkhi h css,js and all so that it can include them too with html)
app.use(express.static('public'));
app.use(express.json());

//global middleware .....jo har request pr kaam krte h mtlb execute hote h.
app.use((req,res,next) => {
    res.locals.session = req.session;//bhyi globally aapin session naam ka variable m store kr diya aapna session ib aapi layout.ejs session use kr ska ha. 
    next();
})


//set template engine
app.use(expressLayout);
app.set('views', viewsPath);
app.set('view engine', 'ejs');


//routes
require('./routes/web')(app);








app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})