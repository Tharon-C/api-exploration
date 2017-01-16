var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');
var morgan = require('morgan');
var genUid = require('../genUid');
var data = require('./data');

var id = 0;

var copy = arr => arr.map(a => Object.assign({}, a));
var images = copy(data.images);
var providers = copy(data.providers);

var updateId = function(req, res, next) {
    if (!req.body.id) {
        req.body.id = genUid.uid();
    }
    next();
};
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
};

app.use(morgan('dev'))
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(allowCrossDomain);

app.use(function(err, req, res, next) {
    if (err) {
        res.status(500).send(error);
    }
});

//===========
// Control
// ==========
//
app.get('/reset', function(req, res) {
    images = copy(data.images);
    providers = copy(data.providers);
    res.json({images:images, providers:providers});
});

//===========
// Images 
// ==========
//
app.get('/images', function(req, res){
    setTimeout(
        () => { res.json(images) },
    500);
});

app.get('/images/:id', function(req, res){
    var id = req.params.id;
    var image = _.find(images, {id: id});
    res.json(image || {});
});

app.post('/images', updateId, function(req, res) {
    var image = req.body;
    images.push(image);
    setTimeout(
        () => { res.json(image) },
    1000);
});


app.put('/images/:id', function(req, res) {
    var update = req.body;
    if (update.id) {
        delete update.id
    }

    var image = _.findIndex(images, {id: req.params.id});
    if (!images[image]) {
        res.send();
    } else {
        var updatedimage = _.assign(images[image], update);
        res.json(updatedimage);
    }
});

app.delete('/images', function(req, res) {
    var image = req.body;
    var index = findWithAttr(images, "id", image.id);
    if ( index === -1 ) { 
        res.send() 
    } else {
        images.splice(index, 1);
        res.json(image);
    }
});

//===========
// providers 
// ==========
//
app.get('/providers', function(req, res){
    setTimeout(
        () => { res.json(providers) },
    600);
});

app.get('/providers/:id', function(req, res){
    var id = req.params.id;
    var provider = _.find(providers, {id: id});
    res.json(provider || {});
});

app.post('/providers', updateId, function(req, res) {
    var provider = req.body;
    providers.push(provider);
    res.json(provider);
});

app.put('/providers/:id', function(req, res) {
    var update = req.body;
    if (update.id) {
        delete update.id
    }
    var provider = _.findIndex(providers, {id: req.params.id});
    if (!providers[provider]) {
        res.send();
    } else {
        var updatedProvider = _.assign(providers[provider], update);
        providers[provider] = updatedProvider;

        res.json(updatedProvider);
    }
});

app.listen(3000);
console.log('on port 3000');
