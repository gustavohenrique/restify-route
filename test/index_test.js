var expect = require('chai').expect,
    request = require('supertest'),
    restify = require('restify'),
    route = require('../index');

describe('restify-route', function() {

    var client, server;

    beforeEach(function () {
        server = restify.createServer();
    });

    describe('#set', function () {

        it('Should raise an error if server is not defined', function (done) {
            var callSetWithNoServer = function () {
                route.set('/api/v1', 'get', null);
            };
            expect(callSetWithNoServer).to.throw(Error);
            done();
        });

        it('Should return a response from a GET request', function (done) {
            route.use(server).set('/test', 'get', function (req, res) {
                res.end();
            });

            client = request(server);
            client.get('/test').expect(200, done);
        });

        it('The route can be setted using a uppercase http method', function (done) {
            route.use(server).set('/test', 'POST', function (req, res) {
                res.end();
            });

            client = request(server);
            client.post('/test').expect(200, done);
        });

        it('If the specified http method is invalid then it uses the GET as default', function (done) {
            route.use(server).set('/test', 'INVALID', function (req, res) {
                res.end();
            });

            client = request(server);
            client.get('/test').expect(200, done);
        });

        it('Should return an empty response if no callback function was defined', function (done) {
            route.use(server).set('/test', 'get');

            client = request(server);
            client.get('/test').expect(204, done);
        });     

    });

});