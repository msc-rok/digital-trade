
"use strict";

const await = require('asyncawait/await');
const util = require('util');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

var _id;
var _result;
var _receipt;
var _quality;
var _psm;
var _lang;
var _url;

//noinspection JSLint
function OCRResult (result, receipt, quality, psm, lang, url) {
    _result = result;
    _receipt = receipt;
    _quality = quality;
    _psm = psm;
    _lang = lang;
    _url = url;
}

OCRResult.prototype.getId = function(){
    return _id;
}
OCRResult.prototype.getResult = function(){
    return _result;
}
OCRResult.prototype.getReceipt = function(){
    return _receipt;
}
OCRResult.prototype.getQuality = function(){
    return _quality;
}
OCRResult.prototype.getPSM = function(){
    return _psm;
}
OCRResult.prototype.getLang = function(){
    return _lang;
}
OCRResult.prototype.getURL = function(){
    return _url;
}

OCRResult.prototype.save = function (client) {
    console.log("OCRResult.save(): ", JSON.stringify(this));

    var ocrresult = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.ocrresult(result, receipt, quality, psm, lang, url) " +
                " VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;"), [_result, _receipt, _quality, _psm, _lang, _url]));

    _id = ocrresult.rows[0].id;
    console.log("OCRResult.id: ", _id);

    return _id;
}

OCRResult.prototype.get = function (client, id) {
    console.log("OCRResult.get(): ", JSON.stringify(this));

    var condition = `1=1`;
    if (id){
        condition += ` AND id=${id}`;
    }
    if (_receipt){
        condition += ` AND receipt=${_receipt}`;
    }
    //select array_to_json(array_agg(row_to_json(t))) as measures from (select * from $$SCHEMANAME$$.templatesmeasures) t;"
    var OCRResults = await(client.query(tools.replaceSchema(`SELECT * FROM $$SCHEMANAME$$.ocrresult WHERE ${condition};`)));
    
    console.log("OCRResults: ", OCRResults.rows.length);    

    return {ocrresults: OCRResults.rows};
};


module.exports = OCRResult;