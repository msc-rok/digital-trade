
'use strict';

//var async = require('asyncawait/async');
const AWAIT = require('asyncawait/await');

const tools = require('../server/tools');

var OCR = function () {};


OCR.prototype.saveResult = function (res, client, options, result) {
    AWAIT(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.ocr_result(result, receipt, quality, psm, lang, img) " +
                    " VALUES ($1,$2,$3,$4,$5,$6)"), [result, null, 100, options.psm, options.l, null]));
    //myawait(users.auditLog(client, userId, constants.AuditProcess, 'Updated templates (' + name + ')', null, obj.length));
    //myawait(client.query("COMMIT"));
    //res.json({result: 'Rows received: ' + obj.length});
};