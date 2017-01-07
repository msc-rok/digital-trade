//"use strict";


/*jshint node:true */
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Pool = require('pg').Pool;
const types = require('pg').types;

const url = require('url');


//Configure database connection either from environment (on Heroku side) or local config
const connection = config("DATABASE_URL");
types.setTypeParser(1700, function(val) {
    return +val;
});

console.log(connection);

const params = url.parse(connection);
const auth = params.auth.split(':');


const dbconfig = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};
const pool = new Pool(dbconfig);


async(function (pool) {
    let client;
    try {
        client = await(pool.connect());
        let dbresult = await(client.query("SELECT * FROM version()"));
        client.release();
        console.log(dbresult.rows[0].version);
    } catch (error) {
        console.log(error);
    }
})(pool);



module.exports = pool;