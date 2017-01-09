
//'use strict';

//var async = require('asyncawait/async');
const await = require('asyncawait/await');
const util = require('util')

const tools = require('../server/tools');

var Receipt = require('../libs/classReceipt');
var ReceiptItem = require('../libs/classReceiptItem');
var Product = require('../libs/classProduct');

function OCR() {};

var options = {
    l: config("OCR_OPTIONS_LANG") || 'deu',
    psm:  config("OCR_OPTIONS_PSM") || 6
};

const regexMacroPattern = config("OCR_REGEX_PATTERN") || "$NAME$PRICE$QUANTITY"
var regexGroupIndex = { name: 1, price: 2, quantity: 3, ean: 4 };

const regexWhitespaces = '\\s+';

const regexGroups = {
    name : '.+?',
    price: '\\d+\\.\\d+',
    quantity: '\\d',
    EAN: '\\d+'
    // (?P<name>.+?)\s(?<price>\d+\.\d+)\s(?<quantity>\d)

};

OCR.prototype.getOptions = function(){
    return options;
}

OCR.prototype.getRegexOfGroup = function(group, index){
    var groupRegex;
    switch (group)
    {
        case "name":
            groupRegex = regexGroups.name;
            regexGroupIndex.name = index;
            break;
        case "price":
            groupRegex = regexGroups.price;
            regexGroupIndex.price = index;
            break;
        case "quantity":
            groupRegex = regexGroups.quantity;
            regexGroupIndex.quantity = index;
            break;
        case "ean":
            groupRegex = regexGroups.ean;
            regexGroupIndex.ean = index;
            break;
    }
    // (?P<name>.+?)\s+(?P<price>\d+\.\d+)\s+(?P<quantity>\d)
    // (?P<name>.+?)\s+(?P<price>\d+\.\d+)\s(?<quantity>\d)
    return `(${groupRegex})`;
};

OCR.prototype.getRegex = function(macroPattern) {
    var regex = "";
    var groups = macroPattern.split('$');
    var i;
    for (i = 1; i <= groups.length - 1; i += 1) { 
        regex += this.getRegexOfGroup(groups[i].toLowerCase(), i);
        if (i < groups.length-1){
             regex += regexWhitespaces;
        }
    }

    return (regex);

};

OCR.prototype.saveResult = function (res, client, result) {
    console.log('Before ocr.saveResult()');

    var resultJson = {"result": result};
    await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.ocrresult(result, receipt, quality, psm, lang, img) " +
                " VALUES ($1,$2,$3,$4,$5,$6)"), [JSON.stringify(resultJson), null, 1.0, options.psm, options.l, null]));

    var receipt = new Receipt(null, null, 1234, new Date);
    receipt.save(client);
   
    var regexPattern = this.getRegex(regexMacroPattern);
    console.log('regexMacroPattern: ',regexMacroPattern)
    console.log('regexPattern: ',regexPattern)

    var regex = new RegExp(regexPattern,"g");

    var product;
    var products = [];
    var receiptItem;
    var receiptItems = [];
    var match;
    while (match = regex.exec(result)) {
        /*var i;
        for (i = 0; i <= match.length - 1; i += 1) { 
            console.log(`Match ${i}: ${match[i]}`);
        }*/
        console.log(`receiptItem.save: ${match[0]}`);

        product = new Product(match[regexGroupIndex.name]);
        product.save(client);
        products.push(product);

        receiptItem = new ReceiptItem(receipt.getId(), product.getId(), match[regexGroupIndex.price], match[regexGroupIndex.quantity])
        receiptItem.save(client);
        receiptItems.push(receiptItem);
    }

    var response = {receipts: receipt,
        products: products,
        receiptitems: receiptItems
    }

    console.log('After ocr.saveResult()');
    console.log(util.inspect(myObject, false, null));

    return response;
    //await(users.auditLog(client, userId, constants.AuditProcess, 'Updated templates (' + name + ')', null, obj.length));
    //await(client.query("COMMIT"));
    //res.json({result: 'Rows received: ' + obj.length});
};

module.exports = new OCR();