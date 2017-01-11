
"use strict";

const await = require('asyncawait/await');
const util = require('util');

//Project references
const tools = require('../server/tools');
const constants = require('../libs/constants');

var _id;

/**
 * Constructor
 */
function OCRResult (result, receipt, quality, psm, lang, url) {
    this._id = null;
    this.result = result;
    this.receipt = receipt;
    this.quality = quality;
    this.psm = psm;
    this.lang = lang;
    this.url = url;
}

OCRResult.prototype.getId = function(){
    return _id;
}

/**
 * Save object to DB
 */
OCRResult.prototype.save = function (client) {
    console.log("OCRResult.save(): ", JSON.stringify(this));

    var ocrresult = await(client.query(tools.replaceSchema("INSERT INTO $$SCHEMANAME$$.ocrresult(result, receipt, quality, psm, lang, url) " +
                " VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;"), [this.result, this.receipt, this.quality, this.psm, this.lang, this.url]));

    this._id = ocrresult.rows[0].id;
    console.log("OCRResult.id: ", this._id);

    return this._id;
}

/**
 * Get specific/all object(s)
  */
OCRResult.prototype.get = function (client, id) {
    console.log("OCRResult.get(): ", JSON.stringify(this));

    var condition = `1=1`;
    if (id){
        condition += ` AND id=${id}`;
    }
    if (this.receipt){
        condition += ` AND receipt=${this.receipt}`;
    }
    //select array_to_json(array_agg(row_to_json(t))) as measures from (select * from $$SCHEMANAME$$.templatesmeasures) t;"
    var OCRResults = await(client.query(tools.replaceSchema(`SELECT * FROM $$SCHEMANAME$$.ocrresult WHERE ${condition};`)));
    
    console.log("OCRResults: ", OCRResults.rows.length);    

    return OCRResults.rows;
};


module.exports = OCRResult;