const mongoose = require('mongoose');
module.exports = (config) => {
    mongoose.connect(config.MongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        console.log("Connected to the database!".green);
    }
    ).catch((err) => {
        console.log("Unable to connect to the database!".red, err);
    }
    );
}