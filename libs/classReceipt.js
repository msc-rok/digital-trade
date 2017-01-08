
"use strict";

const await = require('asyncawait/await');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

var _id;
var _store;
var _user;
var _amount; 
var _date;


//noinspection JSLint
function Receipt (store, user, amount, date) {
    _store = store;
    _user = user;
    _amount = amount; 
    _date = date;
}

Receipt.prototype.getId = function(){
    return _id;
}
Receipt.prototype.getStore = function(){
    return _store;
}
Receipt.prototype.getUser = function(){
    return _user;
}
Receipt.prototype.getAmount = function(){
    return _amount;
}
Receipt.prototype.getDate = function(){
    return _date;
}

Receipt.prototype.save = function (client) {
    console.log("receipt.save(): ", JSON.stringify(this));

    // INSERT INTO ocr.receipt(id, store, "user", amount, date) VALUES (?, ?, ?, ?, ?);
    var receipt = await(client.query(tools.replaceSchema('INSERT INTO $$SCHEMANAME$$.receipt(store, "user", amount, date) ' +
                        "VALUES ($1, $2, $3, $4) RETURNING id;"), [_store, _user, _amount, _date]));

    _id = receipt.rows[0].id;
    console.log("receipt.id: ", _id);

    return _id;
};

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