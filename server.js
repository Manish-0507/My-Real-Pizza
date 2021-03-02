const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;


//path
const viewsPath = path.join(__dirname, '/resources/views');

app.get('/', (req, res) => {
    res.render('home')
})



//set template engine
app.use(expressLayout);
app.set('views', viewsPath);
app.set('view engine', 'ejs');




app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})