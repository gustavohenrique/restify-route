(function () {

    function Route () {

        var self = this,
            HTTP_METHODS = ['del', 'get', 'head', 'options', 'patch', 'post', 'put'];

        this.use = function (server) {
            self.server = server;
            return self;
        };

        this.set = function (path, httpMethod, callback) {
            if (! self.server) {
                throw new Error('The specified server is invalid.');
            }

            httpMethod = httpMethod || 'get';
            
            if (HTTP_METHODS.indexOf(httpMethod.toLowerCase()) === -1) {
                httpMethod = 'get';
            }
            if (typeof(callback) !== 'function') {
                callback = function (req, res) {
                    res.status(204);
                    res.end();
                }
            }
            
            self.server[httpMethod.toLowerCase()](path, callback);

            return self;
        };

    };

    module.exports = new Route();

})();
