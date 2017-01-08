
"use strict";

const await = require('asyncawait/await');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

const similaritylimit = config("DATABASE_SIMILARITY_LIMIT") || 0.6

//noinspection JSLint
function ReceiptItem () {
};


ReceiptItem.prototype.save = function (client, receipt, name, price, quantity) {
    // INSERT INTO ocr.receipt_item(receipt, id, product, price, quantity) VALUES (?, ?, ?, ?, ?);
    // INSERT INTO ocr.receipt(id, store, "user", amount, date) VALUES (?, ?, ?, ?, ?);
    // INSERT INTO ocr.product(id, name) VALUES (?, ?);
    
    console.log("name: ", name);
    console.log("price: ", price);
    console.log("quantity: ", quantity);

    await(client.query("SELECT set_limit($1); ", [similaritylimit]));
    var productSimilar = await(client.query(tools.replaceSchema(
        "SELECT similarity(p.name, $1) AS sim, p.id, p.name " +
        "FROM   $$SCHEMANAME$$.product p "+
        "WHERE  p.name % $1 " +
        "ORDER  BY sim DESC LIMIT 1;"), [name]));
    
    var productid;
    if (productSimilar.rows.length > 0){
        console.log("productSimilar: ", JSON.stringify(productSimilar.rows[0]) );
        productid = productSimilar.rows[0].id;
    }else{
        var product = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.product(name) " +
                        "VALUES ($1) RETURNING id;"), [name]));
        productid=product.rows[0].id;
        }
    
    console.log("product.id: ", productid);
    
    var receipt_item = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.receipt_item(receipt, product, price, quantity) " +
                        " VALUES ($1,$2,$3,$4) RETURNING id;"), [receipt, productid, price, quantity]));
    console.log("receipt_item.id: ", receipt_item.rows[0].id);
};


module.exports = new ReceiptItem();