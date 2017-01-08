
//'use strict';

//var async = require('asyncawait/async');
const await = require('asyncawait/await');

const tools = require('../server/tools');
const receiptItem = require('../libs/classReceiptItem');


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
    //console.log('JSON.stringify(resultJson): ',JSON.stringify(resultJson))

    console.log('regexMacroPattern: ',regexMacroPattern)
   
    var regexPattern = this.getRegex(regexMacroPattern);
    console.log('regexPattern: ',regexPattern)

    

    var regex = new RegExp(regexPattern,"g");

    // INSERT INTO ocr.receipt(id, store, "user", amount, date) VALUES (?, ?, ?, ?, ?);
    var receipt = await(client.query(tools.replaceSchema('INSERT INTO $$SCHEMANAME$$.receipt(store, "user", amount, date) ' +
                        "VALUES ($1, $2, $3, $4) RETURNING id;"), [null, null, 1234, new Date()]));
    console.log("receipt.id: ", receipt.rows[0].id);

    var match;
    while (match = regex.exec(result)) {
        var i;
        /*for (i = 0; i <= match.length - 1; i += 1) { 
            console.log(`Match ${i}: ${match[i]}`);
        }*/
        console.log(`receiptItem.save: ${match[0]}`);
        await(receiptItem.save(client, receipt.rows[0].id, match[regexGroupIndex.name], match[regexGroupIndex.price], match[regexGroupIndex.quantity]));
    }


    await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.ocrresult(result, receipt, quality, psm, lang, img) " +
                    " VALUES ($1,$2,$3,$4,$5,$6)"), [JSON.stringify(resultJson), null, 1.0, options.psm, options.l, null]));
    console.log('After ocr.saveResult()');
    
    //await(users.auditLog(client, userId, constants.AuditProcess, 'Updated templates (' + name + ')', null, obj.length));
    //await(client.query("COMMIT"));
    //res.json({result: 'Rows received: ' + obj.length});
};

module.exports = new OCR();