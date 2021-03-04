require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
require('./db/db');
const session = require('express-session');
const flash = require('express-flash');//inse hum message flash kr skte h or ye hote h single request k liye.
var MongoStore = require('connect-mongo').default;
const passport = require('passport');



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


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})