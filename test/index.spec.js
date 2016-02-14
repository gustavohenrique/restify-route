var expect = require('chai').expect;
var request = require('supertest');
var restify = require('restify');
var route = require('../index');

var TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJhYmNkMDEyMzQ1IiwiZW1haWwiOiJ0MUBjb21wYW55LmNvbSIsImlhdCI6MTQyMTc2NzAzN30.YfqG1o7QXzdHNR9mc_ai8kX_1_WbvvQHstn_53v9Tro';

describe('restify-route', function() {

    var client;
    var server;
    var authByToken = function (req, next, decoded) {
        req.user = decoded;
        next();
    };

    beforeEach(function () {
        server = restify.createServer();
        route.use(null);
    });

    describe('#jwt', function () {

        it('Access not authorized', function (done) {
            route
                .use(server)
                .jwt({
                    secretOrPrivateKey: 'gustavohenrique',
                    callback: authByToken,
                    allwaysVerifyAuthentication: false
                })
                .set('/auth', 'post', function (req, res) {
                    res.send();
                }, true);

            client = request(server);
            client.post('/auth').send({login: 'root'}).expect(403, done);            
        });

        it('Does not verify for authentication', function (done) {
            route
                .use(server)
                .jwt({
                    secretOrPrivateKey: 'gustavohenrique',
                    callback: authByToken,
                    allwaysVerifyAuthentication: true
                })
                .set('/auth', 'get', function (req, res) {
                    res.send(204);
                }, false);

            client = request(server);
            client.get('/auth').expect(204, done);            
        });

        it('Run the callback does not authenticate with no token', function (done) {
            route
                .use(server)
                .jwt({
                    secretOrPrivateKey: 'gustavohenrique',
                    callback: authByToken,
                    allwaysVerifyAuthentication: true
                })
                .set('/auth', 'get', function (req, res) {
                    res.send(204);
                });

            client = request(server);
            client.get('/auth').expect(403, done);            
        });

        it('Run the callback authenticate with token', function (done) {
            route
                .use(server)
                .jwt({
                    secretOrPrivateKey: '63e018bf2fdab802b710f092e58ca464020e825f',
                    callback: authByToken,
                    allwaysVerifyAuthentication: true
                })
                .set('/projects/:id', 'get', function (req, res) {
                    res.send(200, req.user);
                });

            client = request(server);
            client
                .get('/projects/1')
                .set('authorization', 'Bearer ' + TOKEN)
                .end(function (err, res) {
                    expect(res.status).to.equal(200);
                    expect(res.body.email).to.equal('t1@company.com');
                    expect(res.body.uid).to.equal('abcd012345');
                    done();
                });            
        });
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

        it('Should return a response from a DELETE request', function (done) {
            route.use(server).set('/test', 'del', function (req, res) {
                res.end();
            });

            client = request(server);
            client.delete('/test').expect(200, done);
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
