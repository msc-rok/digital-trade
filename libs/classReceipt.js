
"use strict";

const await = require('asyncawait/await');
const util = require('util');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

var _id;

/**
 * Constructor
 */
function Receipt (store, user, amount, date) {
    this._id = null;
    this.store = store;
    this.user = user;
    this.amount = amount; 
    this.date = date;
}

Receipt.prototype.getId = function(){
    return this._id;
}

/**
 * Save object to DB
 */
Receipt.prototype.save = function (client) {
    console.log("receipt.save(): ", JSON.stringify(this));

    // INSERT INTO ocr.receipt(id, store, "user", amount, date) VALUES (?, ?, ?, ?, ?);
    var receipt = await(client.query(tools.replaceSchema('INSERT INTO $$SCHEMANAME$$.receipt(store, "user", amount, date) ' +
                        "VALUES ($1, $2, $3, $4) RETURNING id;"), [this.store, this.user, this.amount, this.date]));

    this._id = receipt.rows[0].id;
    console.log("receipt.id: ",this. _id);

    return this._id;
};

/**
 * Get specific/all object(s)
  */
Receipt.prototype.get = function (client, id) {
    console.log("receipt.get(): ", JSON.stringify(this));

    var condition = `1=1`;
    if (id){
        condition += ` AND id=${id}`;
    }
    var receipt = await(client.query(tools.replaceSchema(`SELECT * FROM $$SCHEMANAME$$.receipt WHERE ${condition};`)));
    
    console.log("receipt: ", receipt.rows.length);    

    return receipt.rows;
};


module.exports = Receipt;