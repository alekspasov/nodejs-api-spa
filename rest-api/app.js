const express = require('express');

const app = express();
const feedRoutes = require('./routes/feed');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');

const mongodbURI = require('./util/constants');




app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

mongoose.connect(mongodbURI)
    .then(result=>{
        app.listen(8080);
    }).catch(err=>console.log(err));