
//'use strict';

//var async = require('asyncawait/async');
const await = require('asyncawait/await');
const util = require('util');

const tools = require('../server/tools');

var OCRResult = require('../libs/classOCRResult')
var Receipt = require('../libs/classReceipt');
var ReceiptItem = require('../libs/classReceiptItem');
var Product = require('../libs/classProduct');

const _regexWhitespaces = '\\s+';

function OCR(receipt) {
    this.options = {
        l: config("OCR_OPTIONS_LANG") || 'deu',
        psm:  config("OCR_OPTIONS_PSM") || 6
    };

    this.regexItemPatternMacro = config("OCR_ITEM_PATTERN") || "$NAME$PRICE$QUANTITY"
    this.regexGroupIndex = { name: null, price: null, quantity: null, ean: null };

    this.regexPattern = "";
    this.quality = 1.0;

    this.receipt = receipt;
    this.ocrresult = null;
    this.products = [];
    this.receiptItems = [];
};

const regexGroups = {
    name : '.+?',
    price: '\\d+\\.\\d+',
    quantity: '\\d',
    ean: '\\d+'
    // (?P<name>.+?)\s(?<price>\d+\.\d+)\s(?<quantity>\d)

};

OCR.prototype.getRegexOfGroup = function(group, index){
    var groupRegex;
    switch (group)
    {
        case "name":
            groupRegex = regexGroups.name;
            this.regexGroupIndex.name = index;
            break;
        case "price":
            groupRegex = regexGroups.price;
            this.regexGroupIndex.price = index;
            break;
        case "quantity":
            groupRegex = regexGroups.quantity;
            this.regexGroupIndex.quantity = index;
            break;
        case "ean":
            groupRegex = regexGroups.ean;
            this.regexGroupIndex.ean = index;
            break;
        default:
            groupRegex = group;
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
             regex += this._regexWhitespaces;
        }
    }

    return (regex);

};

OCR.prototype.process = function (client, text, url){

    this.regexPattern = this.getRegex(this.regexItemMacroPattern);

    var regex = new RegExp(this.regexPattern,"g");

    var product;
    var receiptItem;
    var match;
    while (match = regex.exec(text)) {
        /*var i;
        for (i = 0; i <= match.length - 1; i += 1) { 
            console.log(`Match ${i}: ${match[i]}`);
        }*/
        console.log(`receiptItem.save: ${match[0]}`);

        product = new Product(match[this.regexGroupIndex.name]);
        product.save(client);
        
        receiptItem = new ReceiptItem(this.receipt.getId(), product.getId(), match[regexGroupIndex.price], match[regexGroupIndex.quantity])
        receiptItem.save(client);

        this.products.push(product);
        this.receiptItems.push(receiptItem);
    }

    this.ocrresult = new OCRResult({text: text}, this.receipt,this.quality, options.psm, options.l, url)
    this.ocrresult.save(client);

    var response = {ocrresult: this.ocrresult,
        receipt: this.receipt,
        products: this.products,
        receiptitems: this,receiptItems
    }

    console.log(`After ocr.saveResult(${util.inspect(response, false, null)})`);

    return response;
}

OCR.prototype.saveResult = function (client, text, url) {
    console.log('Before ocr.saveResult()');

    
};

module.exports = OCR;