
//'use strict';

//var async = require('asyncawait/async');
const await = require('asyncawait/await');

const tools = require('../server/tools');

var OCR = function () {};

const regexWhitespaces = '"\s+"'

const regexGroups = {
    name : ".+?",
    price: "\d+\.\d+",
    quantity: "\d",
    EAN: "\d+"
    // (?P<name>.+?)\s(?<price>\d+\.\d+)\s(?<quantity>\d)

};

OCR.prototype.getRegexOfGroup = function(group){
    var groupRegex;
    switch (group)
    {
        case "name":
            groupRegex = regexGroups.name;
            break;
        case "price":
            groupRegex = regexGroups.price
            break;
        case "quantity":
            groupRegex = regexGroups.quantity
            break;
        case "ean":
            groupRegex = regexGroups.ean
            break;
    }

    return ("(?P<$1>$2)", [group, groupRegex]);
};

OCR.prototype.getRegex = function(macroPattern) {
    var regex = "";
    var groups = macroPattern.split('$');
    var i;
    for (i = 0; i <= groups.length - 1; i += 1) { 
        regex += this.getRegexOfGroup(groups[i].toLowerCase());
        if (i < groups.length-1){
             regex += regexWhitespaces;
        }
    }

    return (regex);

};

OCR.prototype.saveResult = function (res, client, options, result) {
    console.log('Before ocr.saveResult()');

    var resultJson = {"result": result};
    console.log('JSON.stringify(resultJson): ',JSON.stringify(resultJson))

    var regexMacroPattern = config("OCR_REGEX_PATTERN") || "$NAME$PRICE$QUANTITY$EAN"
    var regexPattern = this.getRegex(regexMacroPattern);
    
    var regex = new RegExp(regexPattern);

    var match;
    while ((match = regex.exec(result)) !== null) {
        var i;
        for (i = 0; i <= match.length - 1; i += 1) { 
            console.log("Match $1: $2", [i, match[i]]);
         }
    }


    await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.ocr_result(result, receipt, quality, psm, lang, img) " +
                    " VALUES ($1,$2,$3,$4,$5,$6)"), [JSON.stringify(resultJson), null, 1.0, options.psm, options.l, null]));
    console.log('After ocr.saveResult()');
    
    //await(users.auditLog(client, userId, constants.AuditProcess, 'Updated templates (' + name + ')', null, obj.length));
    //await(client.query("COMMIT"));
    //res.json({result: 'Rows received: ' + obj.length});
};

module.exports = new OCR();