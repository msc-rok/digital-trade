
//'use strict';

//var async = require('asyncawait/async');
const await = require('asyncawait/await');
const util = require('util');

const tools = require('../server/tools');

var OCRResult = require('../libs/classOCRResult')
var Receipt = require('../libs/classReceipt');
var ReceiptItem = require('../libs/classReceiptItem');
var Product = require('../libs/classProduct');

const _regexWhitespaces = '[ \\t]+'; //whitespace or tab (no newline)

/**
 * Constructor
 */
function OCR(receipt) {
    this.options = {
        l: process.env.OCR_OPTIONS_LANG || 'deu',
        psm:  process.env.OCR_OPTIONS_PSM || 6
    };

    this.regexItemPatternMacro = process.env.OCR_ITEM_PATTERN || "NAME PRICE QUANTITY"
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
    price: '\\d+([\\.\\,])\\d+',
    quantity: '\\d+',
    ean: '\\d+'
};

OCR.prototype.getRegexOfGroup = function(group, index){
    var groupRegex;
    switch (group.toLowerCase())
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
    // (.+?)\h+(\d+([\.\,])\d+)\h+([AB]{1})
    // (.+?)[ \t]+(\d+([\.\,])\d+)[ \t]+([12]{1})
    // (?P<name>.+?)\s+(?P<price>\d+\.\d+)\s+(?P<quantity>\d)
    // (?P<name>.+?)\s+(?P<price>\d+\.\d+)\s(?<quantity>\d)
    return `(${groupRegex})`;
};

OCR.prototype.getRegex = function(macroPattern) {
    var regex = "";
    var groups = macroPattern.split(/[ ]+/);
    var i;
    for (i = 0; i <= groups.length - 1; i += 1) {
        regex += this.getRegexOfGroup(groups[i], i + 1);
        if (i < groups.length-1){
             regex += _regexWhitespaces;
        }
    }
    console.log(`regex=${regex}`);
    return (regex);

};

/**
 * Prototype OCR-engine
 */
OCR.prototype.process = function (client, text, url){

    // store ocrresult (including cloud url, ocr optins, etc.)
    this.ocrresult = new OCRResult({text: text}, this.receipt, this.quality, this.options.psm, this.options.l, url)
    this.ocrresult.save(client);

    // constructs regex pattern for receipt item
    this.regexPattern = this.getRegex(this.regexItemPatternMacro);
    var regex = new RegExp(this.regexPattern,"g");

    var product;
    var receiptItem;
    var match;
    var price;
    var quantity;
    //for each match (receipt item)
    while (match = regex.exec(text)) {

        console.log(`receiptItem.save: ${match[0]}`);

        // create master data product instance
        product = new Product(match[this.regexGroupIndex.name]);
        //find similar or create new product
        product.save(client);
        
        price = match[this.regexGroupIndex.price];
        quantity = match[this.regexGroupIndex.quantity];

        // sperator correction
        if(price){
            price = price.replace(/,/g, '.')}
        }
       
        // create receipt item instance (replace seperator "," with "." for prices)
        // TODO: only product, price and quantity are supported. Additional attributes like EAN, etc. to be implemented.
        receiptItem = new ReceiptItem(this.receipt, product.getId(), price, quantity)
        receiptItem.save(client);

        // save created instances for result array
        this.products.push(product);
        this.receiptItems.push(receiptItem);
    }

    // log object completely
    console.log(`After ocr.process(${util.inspect(this, false, null)})`);

    // construct and return response
    var response = {ocrresult: this.ocrresult,
        receipt: this.receipt,
        products: this.products,
        receiptitems: this.receiptItems
    }

    return response;
}

module.exports = OCR;