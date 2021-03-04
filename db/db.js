const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myPizza',
    {
        useNewUrlParser: true, useCreateIndex: true,
        useUnifiedTopology: true, useFindAndModify: true
    }).then(() => {
        console.log('Database connected!');
    }).catch((err) => {
        console.log(`error in connecting to database ${err}`);
    })




