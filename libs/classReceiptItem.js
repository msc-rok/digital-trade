
"use strict";

const await = require('asyncawait/await');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');


//noinspection JSLint
function ReceiptItem () {
};


ReceiptItem.prototype.save = function (client, name, price, quantity) {
    // INSERT INTO ocr.receipt_item(receipt, id, product, price, quantity) VALUES (?, ?, ?, ?, ?);
    // INSERT INTO ocr.receipt(id, store, "user", amount, date) VALUES (?, ?, ?, ?, ?);
    // INSERT INTO ocr.product(id, name) VALUES (?, ?);
    var product = await(client.query(tools.replaceSchema("INSERT INTO ocr.product(name) " +
                        "VALUES ($1) RETURNING id;"), [name]));
    console.log("product.id: ", product.rows[0].id);
    
    var receipt_item = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.receipt_item(receipt, product, price, quantity) " +
                        " VALUES ($1,$2,$3,$4) RETURNING id;"), [null, product.rows[0].id, price, quantity]));
    console.log("receipt_item.id: ", receipt_item.rows[0].id);
};


module.exports = ReceiptItem();