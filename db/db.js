const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION_URL,
    {
        useNewUrlParser: true, useCreateIndex: true,
        useUnifiedTopology: true, useFindAndModify: true
    }).then(() => {
        console.log('Database connected!');
    }).catch((err) => {
        console.log(`error in connecting to database ${err}`);
    })




