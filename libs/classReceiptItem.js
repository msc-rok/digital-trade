
"use strict";

const await = require('asyncawait/await');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

var _id;
var _receipt;
var _product;
var _price;
var _quantity;

//noinspection JSLint
function ReceiptItem (receipt, product, price, quantity) {
    _receipt = receipt;
    _product = product;
    _price = price;
    _quantity = quantity;
};

ReceiptItem.prototype.getId = function(){
    return _id;
}
ReceiptItem.prototype.getReceipt = function(){
    return _receipt;
}
ReceiptItem.prototype.getProduct = function(){
    return _product;
}
ReceiptItem.prototype.getPrice = function(){
    return _price;
}
ReceiptItem.prototype.getQuantity = function(){
    return _quantity;
}


ReceiptItem.prototype.save = function (client) {
    // INSERT INTO ocr.receipt_item(receipt, id, product, price, quantity) VALUES (?, ?, ?, ?, ?);;
    console.log("ReceiptItem.save: ", JSON.stringify(this));

    var receipt_item = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.receipt_item(receipt, product, price, quantity) " +
                        " VALUES ($1,$2,$3,$4) RETURNING id;"), [_receipt, _product, _price, _quantity]));
    _id = receipt_item.rows[0].id;
    console.log("receipt_item.id: ", _id);
    
    return _id;
};


module.exports = ReceiptItem;