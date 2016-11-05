'use strict';

/* globals logger, logmessages, config, util, CasException */

var fs = require('fs');


/*Setting the globals */
global.config = require('./common/config');
global.util = require('./common/util').Util;
var TLogger = require('./common/log').TLogger;
global.logger = new TLogger();
global.logmessages = JSON.parse(fs.readFileSync('build/common/log-messages.json'));

global.CasException = require('./common/exception/CasException');

logger.setLevel(config('LOG_LEVEL'));
logger.setLogPerfPathInMessage(false);

var express = require('express');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var compression = require('compression');

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var http = require('http');

/* TBD
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config('SFDC_PUBKEY')
};*/

passport.use('GetMeasures',new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config('SFDC_PUBKEY'),
  audience: '/ACSF/Promotion/GetMeasures'
}, function (jwtPayload, done) {
  logger.debug(logmessages['WS1007'].code, logmessages['WS1007'].message, jwtPayload);
  return done(null, jwtPayload);
}));

passport.use('GetMeasuresCalculatedWriteback',new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config('SFDC_PUBKEY'),
  audience: '/ACSF/Promotion/GetMeasuresCalculatedWriteback'
}, function (jwtPayload, done) {
  logger.debug(logmessages['WS1007'].code, logmessages['WS1007'].message, jwtPayload);
  return done(null, jwtPayload);
}));

passport.use('GetTacticProducts',new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config('SFDC_PUBKEY'),
  audience: '/ACSF/Promotion/GetTacticProducts'
}, function (jwtPayload, done) {
  logger.debug(logmessages['WS1007'].code, logmessages['WS1007'].message, jwtPayload);
  return done(null, jwtPayload);
}));

passport.use('GetMessageContinuation', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config('SFDC_PUBKEY'),
  audience: '/ACSF/GetMessageContinuation'}, function(jwtPayload, done) {
    logger.debug(logmessages['WS1007'].code, logmessages['WS1007'].message, jwtPayload);
    return done(null, jwtPayload);
  })
);

passport.use('GetPromotionsByView',new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config('SFDC_PUBKEY'),
  audience: '/ACSF/Promotion/GetPromotionsByView'
}, function (jwtPayload, done) {
  logger.debug(logmessages['WS1007'].code, logmessages['WS1007'].message, jwtPayload);
  return done(null, jwtPayload);
}));

passport.use('InitializeCache',new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config('SFDC_PUBKEY'),
  audience: '/ACSF/InitializeCache'
}, function (jwtPayload, done) {
  logger.debug(logmessages['WS1007'].code, logmessages['WS1007'].message, jwtPayload);
  return done(null, jwtPayload);
}));

passport.use('GetPromotionKPIs',new JwtStrategy({
  jwtFromRequest:ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey:config('SFDC_PUBKEY'),
  audience: '/ACSF/GetPromotionKPIs'},function(jwtPayload,done){
     logger.debug(logmessages['WS1007'].code,logmessages['WS1007'].message,jwtPayload);
     return done(null,jwtPayload);
  })
);

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.xml({
	  xmlParseOptions: {
	    normalizeTags: true
	  }
}));


app.post('/ACSF/Promotion/GetPromotionsByView', passport.authenticate('GetPromotionsByView', { session: false }), require('./rest/GetPromotionsByView'));

app.post('/ACSF/Promotion/GetMeasures', passport.authenticate('GetMeasures', { session: false }), require('./rest/GetMeasures'));

app.post('/ACSF/Promotion/GetMeasuresCalculatedWriteback', passport.authenticate('GetMeasuresCalculatedWriteback', { session: false }), require('./rest/GetMeasuresCalculatedWriteback'));

app.post('/ACSF/Promotion/GetTacticProducts', passport.authenticate('GetTacticProducts', { session: false }), require('./rest/GetTacticProducts'));

app.get('/ACSF/GetMessageContinuation/:id/:page', passport.authenticate('GetMessageContinuation', { session: false }), require('./rest/GetMessageContinuation'));

app.post('/ACSF/InitializeCache',passport.authenticate('InitializeCache', { session: false }), require('./rest/InitializeCache'));

app.post('/ACSF/GetPromotionKPIs',passport.authenticate('GetPromotionKPIs',{session:false}), require('./rest/GetPromotionKPIs'));

/*Authentication done via SF SessionId & URL */
app.post('/ACSF/Promotion/TriggerPromotionLoader', require('./rest/TriggerPromotionLoader'));


var port = config('PORT') || 5000;
logger.info(logmessages['WS0001'].code, logmessages['WS0001'].message, { 'port': port });

app.server = http.createServer(app);
app.server.listen(port);

module.exports = app;



