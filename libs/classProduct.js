
"use strict";

const await = require('asyncawait/await');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

const similaritylimit = config("DATABASE_SIMILARITY_LIMIT") || 0.6

var _name;
var _id;

//noinspection JSLint
function Product (client, name) {
    _name = name;
    _id = this.findSimilar(client,name);
    if (!_id) {
        _id = this.add(client,name);
    }
}

Product.prototype.getId = function(){
    return _id;
}

Product.prototype.getName = function(){
    return _name;
}

Product.prototype.findSimilar = function (client, name) {
    console.log("product.findSimilar(%s)", name);

    await(client.query("SELECT set_limit($1); ", [similaritylimit]));
    var productSimilar = await(client.query(tools.replaceSchema(
        "SELECT similarity(p.name, $1) AS sim, p.id, p.name " +
        "FROM   $$SCHEMANAME$$.product p "+
        "WHERE  p.name % $1 " +
        "ORDER  BY sim DESC LIMIT 1;"), [name]));
    
    var productid;
    if (productSimilar.rows.length > 0){
        console.log("similar found: ", JSON.stringify(productSimilar.rows[0]) );
        productid = productSimilar.rows[0].id;
    }else{
        console.log("similar not found! Limit: ", similaritylimit);
        }
    
    console.log("product.id: ", productid);
    return productid;
};

Product.prototype.add = function (client, name) {
    console.log("product.add(%s)", name);

    // INSERT INTO ocr.product(id, name) VALUES (?, ?);
    var product = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.product(name) " +
                        "VALUES ($1) RETURNING id;"), [name]));
    var productid = product.rows[0].id;
    
    console.log("product.id: ", productid);

    return productid;
};


module.exports = Product;