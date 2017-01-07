
//'use strict';

//var async = require('asyncawait/async');
const await = require('asyncawait/await');

const tools = require('../server/tools');

var OCR = function () {};


OCR.prototype.saveResult = function (res, client, options, result) {
    console.log('Before ocr.saveResult(%s)',result)
    console.log('json.stringify(result): ',json.stringify(result))
    /*  await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.ocr_result(result, receipt, quality, psm, lang, img) " +
                    " VALUES ($1,$2,$3,$4,$5,$6)"), [result, null, 100, options.psm, options.l, null]));
        console.log('After ocr.saveResult()')
    */
    //await(users.auditLog(client, userId, constants.AuditProcess, 'Updated templates (' + name + ')', null, obj.length));
    //await(client.query("COMMIT"));
    //res.json({result: 'Rows received: ' + obj.length});
};

module.exports = new OCR();