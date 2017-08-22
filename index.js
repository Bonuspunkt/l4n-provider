module.exports = function(settings) {

    require('./lib/udpResponder');
    require('./lib/httpsServer')(settings.https);

}
