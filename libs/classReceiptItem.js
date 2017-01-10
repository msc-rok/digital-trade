
"use strict";

const await = require('asyncawait/await');
const util = require('util');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

var _id;

//noinspection JSLint
function ReceiptItem (receipt, product, price, quantity) {
    this.receipt = receipt;
    this.product = product;
    this.price = price;
    this.quantity = quantity;
};

ReceiptItem.prototype.getId = function(){
    return this._id;
}


ReceiptItem.prototype.save = function (client) {
    // INSERT INTO ocr.receipt_item(receipt, id, product, price, quantity) VALUES (?, ?, ?, ?, ?);;
    console.log("ReceiptItem.save: ", JSON.stringify(this));

    var receipt_item = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.receiptitem(receipt, product, price, quantity) " +
                        " VALUES ($1,$2,$3,$4) RETURNING id;"), [this.receipt, this.product, this.price, this.quantity]));
    this._id = receipt_item.rows[0].id;
    console.log("receipt_item.id: ", this._id);
    
    return this._id;
};

ReceiptItem.prototype.get = function (client, id) {
    console.log("ReceiptItem.get(): ", JSON.stringify(this));

    var condition = `1=1`;
    if (id){
        condition += ` AND id=${id}`;
    }
    if (this.product){
        condition += ` AND product=${this.product}`;
    }
   if (this.receipt){
        condition += ` AND receipt=${this.receipt}`;
    }


    var items = await(client.query(tools.replaceSchema(`SELECT * FROM $$SCHEMANAME$$.receiptitem WHERE ${condition};`)));
    
    console.log("items: ", items.rows.length);    

    return items.rows;
};


module.exports = ReceiptItem;