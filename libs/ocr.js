
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
        psm: process.env.OCR_OPTIONS_PSM || 6
    };

    this.regexItemPatternMacro = process.env.OCR_ITEM_PATTERN || "NAME PRICE QUANTITY"
    this.regexGroupIndex = { name: null, price: null, quantity: null, ean: null };

    // constructs regex pattern for receipt item
    this.regexPattern = this.getRegex(this.regexItemPatternMacro);
    this.regex = new RegExp(this.regexPattern, "g");

    this.quality = 1.0;

    this.receipt = receipt;
    this.ocrresult = null;
    this.products = [];
    this.receiptItems = [];
};

const regexGroups = {
    name: '(.+?)',
    price: '(\\d{1,6}[\\.\\,]{1}\\d{2})',
    quantity: '(\\d{1,2})',
    ean: '(\\d+)'
};

OCR.prototype.getRegexOfGroup = function (group, index) {
    var groupRegex;
    switch (group.toLowerCase()) {
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
        case "ean": // TODO: GTIN
            groupRegex = regexGroups.ean;
            this.regexGroupIndex.ean = index;
            break;
        default:
            groupRegex = `(?:${group})`; // (?:...) = non-capturing group
            break;
    }
    // (.+?)\h+(\d+([\.\,])\d+)\h+([AB]{1})
    // (.+?)[ \t]+(\d+([\.\,])\d+)[ \t]+([12]{1})
    // (.+?)[ \t]+(\d+(?:[\.\,])\d+)[ \t]+(\d+)
    // (?P<name>.+?)\s+(?P<price>\d+\.\d+)\s+(?P<quantity>\d)
    // (?P<name>.+?)\s+(?P<price>\d+\.\d+)\s(?<quantity>\d)
    return groupRegex;
};

OCR.prototype.getRegex = function (macroPattern) {
    var regex = "";
    var groups = macroPattern.split(/[ ]+/);
    var i;
    for (i = 0; i <= groups.length - 1; i += 1) {
        regex += this.getRegexOfGroup(groups[i], i + 1);
        if (i < groups.length - 1) {
            regex += _regexWhitespaces;
        }
    }
    console.log(`regex=${regex}`);
    return (regex);

};

/**
 * Prototype OCR-engine
 */
OCR.prototype.process = function (client, text, url) {
    // log object completely
    console.log(`Before ocr.process(${util.inspect(this, false, null)})`);

    // store ocrresult (including cloud url, ocr optins, etc.)
    this.ocrresult = new OCRResult({ text: text }, this.receipt, this.quality, this.options.psm, this.options.l, url)
    this.ocrresult.save(client);

    var product;
    var receiptItem;
    var match;
    
    var name = '';
    var price = '';
    var quantity = '';
    //for each match (receipt item)
    while (match = this.regex.exec(text)) {

        console.log(`match: ${match}`);

        // create master data product instance
        name = match[this.regexGroupIndex.name];
        product = new Product(name);
        //find similar or create new product
        product.save(client);

        // sperator correction
        price = match[this.regexGroupIndex.price];
        if (price) {
            price = price.replace(/,/g, '.')
        }

        quantity = match[this.regexGroupIndex.quantity];

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
    var response = {
        ocrresult: this.ocrresult,
        receipt: this.receipt,
        products: this.products,
        receiptitems: this.receiptItems
    }

    return response;
};

module.exports = OCR;