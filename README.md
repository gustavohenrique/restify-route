restify-route
=============

A lazy way to create restify routes.

```javascript
var restify = require('restify'),
    route = require('restify-route');

var server = restify.createServer();

routes
    .use(server)
    .set('/contact/:id', 'get', function (req, res) {
        res.send('The sent ID: ' + req.params.id);
    })
    .set('/contact/create', 'post', function (req, res) {
        // validation code here
        res.send(400, { error: 'The request does not contains a valid contact.' });
    });

server.listen(3000, '127.0.0.1', function () {
    console.log('Running on http://127.0.0.1:3000');
});
```

See the restify documentation for more information.
