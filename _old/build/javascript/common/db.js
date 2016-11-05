'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('db');
logger.setLevel('DEBUG');
var pg = require('pg');
var pgp = require('pg-promise')();
var url = require('url');
var pgdb;

var connectionString = config('DATABASE_URL');

var pool = new pg.Pool(getConfigFromDbUrl());
var copyFrom = require('pg-copy-streams').from;
var Readable = require('stream').Readable;




var database = {
  submit: function (query, values, cb) {
    if (!pgdb || pgdb === undefined) {
      pgdb = pgp(connectionString);
    }

    pgdb.any(query, values).then(function (result) {
      return cb(null, result);
    }).catch(function (err) {
      return cb(err);
    });

  },


  insert: function (table, columns, data, delimiter, nullstring, cb) {
    pool.connect(function (connectionErr, client, done) {
      // pg.connect(url, function (connectionErr, client, done) {
      if (connectionErr) {
        logger.error('Could not connect to the database: ', connectionErr);
        throw connectionErr;
      }

      var s = new Readable; // jshint ignore:line
      var result, error;
      s.push(data);
      s.push(null);

      var stream = client.query(copyFrom('COPY ' + table + ' (' + columns + ') FROM STDIN WITH DELIMITER \'' + delimiter + '\' NULL \'' + nullstring + '\''), function (err) {
        if (err) {
          // Raise error message
        }
      });
      s.pipe(stream).on('end', function (dbresult) {
        // Success. Write log message;
        result = dbresult;
        // return cb(null, dbresult); //ToDo

      }).on('error', function (err) {
        // Raise error message
        error = err;


      });
      done();
      cb(error, result);

    });

  },
  insertBulk: function (table, schema, columns, data, cb) {

    if (!pgdb || pgdb === undefined) {
      pgdb = pgp(connectionString);
    }

    var columnSet = new pgp.helpers.ColumnSet(columns, { table: new pgp.helpers.TableName(table, schema) });
    var query = pgp.helpers.insert(data, columnSet);

    pgdb.none(query)
      .then(resultData => {
        console.log('Insert of logs into DB returned no error');
        cb(null);
      })
      .catch(error => {
        console.log('Insert of logs into DB raised an error:', error);
        cb(error);
      });
  }

};

function getConfigFromDbUrl() {
  var params = url.parse(connectionString);
  var auth = params.auth.split(':');
  // console.log('params:',params);
  var poolConfig = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: params.path.split('?ssl')[1] !== undefined || config('DATABASE_IS_SSL_MODE_ENABLED') === 'true' || config('DATABASE_IS_SSL_MODE_ENABLED') === true ? true : false
  };
  // console.log(poolConfig.ssl,params.path,JSON.stringify(params.path.split('?ssl')));
  return poolConfig;
}

pool.on('error', function (err) {
  logger.error('An error was caught while client was idle:', err);
});

module.exports = database;