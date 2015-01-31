restify-route
=============

A lazy way to create restify routes.

[![Build Status](https://secure.travis-ci.org/gustavohenrique/restify-route.svg?branch=master)](http://travis-ci.org/gustavohenrique/restify-route)
[![Dependency Status](https://gemnasium.com/gustavohenrique/restify-route.png)](https://gemnasium.com/gustavohenrique/restify-route)


```javascript
var restify = require('restify'),
    routes = require('restify-route');

var server = restify.createServer();

routes
    .use(server)
    .set('/contact/:id', 'get', function (req, res) {
        res.send('The sent ID: ' + req.params.id);
    })
    .set('/contact/create', 'post', function (req, res) {
        // validation code here
        res.send(201, 'created');
    })
    .set('/contact/delete/:id', 'del', function (req, res) {
        res.send('deleted');
    })
    .set('/contact/update', 'put', function (req, res) {
        res.send('updated');
    });

server.listen(3000, '127.0.0.1', function () {
    console.log('Running on http://127.0.0.1:3000');
});
```

See the restify documentation for more information.
