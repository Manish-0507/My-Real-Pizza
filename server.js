const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;


//path
const viewsPath = path.join(__dirname, '/resources/views');


//Assets (mtlb express server response deta h html response to use btana hoga ki sari cheeze kha rkhi h css,js and all so that it can include them too with html)
app.use(express.static('public'));

//set template engine
app.use(expressLayout);
app.set('views', viewsPath);
app.set('view engine', 'ejs');


//routes
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/cart', (req, res) => {
    res.render('customers/cart')
})
app.get('/login', (req, res) => {
    res.render('auth/login')
})
app.get('/register', (req, res) => {
    res.render('auth/register')
})








app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})