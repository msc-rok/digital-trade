"use strict";



const constants = require('../libs/constants');
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true}); // options can be passed, e.g. {allErrors: true}

/*
var Logger = require('../libs/classLogger');
var logger = Logger.TLogger.getLogger("IntegrationWorker");
*/

String.prototype.replaceAll = function (target, replacement) {
    return this.split(target).join(replacement);
};


/**
 * @return {boolean}
 */
function myIntIsInteger(iVal) {
    let iParsedVal; //our internal converted int value

    iParsedVal = parseInt(iVal, 10);

    if (Number.isNaN(iParsedVal) || Infinity === iParsedVal || -Infinity === iParsedVal) {
        return false;
    } else {
        return Number(iVal) === (iParsedVal || 0);
    }
}

function isDate(txtDate) {
    let currVal = txtDate;
    if (currVal === '') {
        return false;
    }
    let rxDatePattern = /^(\d{4})(-)(\d{1,2})(-)(\d{1,2})$/;

    let dtArray = currVal.match(rxDatePattern);

    if (dtArray === null) {
        return false;
    }
    //Checks for mm/dd/yyyy format.
    let dtMonth = dtArray[3];
    let dtDay = dtArray[5];
    let dtYear = dtArray[1];

    if (dtMonth < 1 || dtMonth > 12) {
        return false;
    }
    if (dtDay < 1 || dtDay > 31) {
        return false;
    }
    if ((dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11) && dtDay === 31) {
        return false;
    }
    if (dtMonth === 2) {
        let isleap = (dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0));
        if (dtDay > 29 || (dtDay === 29 && !isleap)) {
            return false;
        }
    }
    return true;
}

function intGetResErr(text, messagecode) {
    return {error: text, code: messagecode};
}

module.exports = {
    /**
     * @return {boolean}
     */
    isInteger: function IsInteger(iVal) {
        return myIntIsInteger(iVal);
    },
    /**
     * @return {boolean}
     */
    isValidTransactionID: function (txId, res) {
        if ((txId === undefined) || ((txId.length < 1) || (txId.length > 20))) {
            res.status(400).send(intGetResErr('Invalid transaction id format', constants.ErrorInvalidTransactionIdFormat));
            return false;
        } else {
            return true;
        }
    },
    isValidLimit: function (limit, res) {
        if ((limit === undefined) || (limit < 1) || (limit > 10000)) {
            res.status(400).send(intGetResErr('Invalid limit. >=1 or <=10000 Required', constants.ErrorInvalidLimitFormat2));
            return false;
        } else {
            return true;
        }

    },
    isValidMessageNumber: function (messageNo, res) {

        if ((messageNo === undefined) || ((!myIntIsInteger(messageNo)) || (parseInt(messageNo, 10) < 1)) || (parseInt(messageNo, 10) > 2147483647)) {
            res.status(400).send(intGetResErr('Invalid number in messages', constants.ErrorInvalidMessageNumberFormat));
            return false;
        } else {
            return true;
        }
    },
    isValidConditionType: function (msgtype, res) {
        if ((msgtype === null) || (msgtype === undefined) || (msgtype.length > 4)) {
            res.status(400).send(intGetResErr('invalid measure type', constants.ErrorInvalidMeasureType));
            return false;
        } else {
            return true;
        }
    },
    isValidProductId: function (product, res) {
        if ((product !== undefined) && (product.length > 30)) {
            res.status(400).send(intGetResErr('invalid product id format', constants.ErrorInvalidProductIDFormat));
            return false;
        } else {
            return true;
        }
    },
    isValidAccountId: function (account, res) {
        if ((account !== undefined) && (account.length > 30)) {
            res.status(400).send(intGetResErr('invalid account id - max length 30', constants.ErrorInvalidAccountIDFormat));
            return false;
        } else {
            return true;
        }
    },
    isValidPromotionId: function (promotion, res) {
        if ((promotion !== undefined) && (promotion.length > 18)) {
            res.status(400).send(intGetResErr('invalid promotion id - max length 30', constants.ErrorInvalidPromotionIDFormat));
            return false;
        } else {
            return true;
        }
    },
    isValidAliveTime: function (alive, res) {
        if ((alive !== undefined) && ((!myIntIsInteger(alive)) || (parseInt(alive, 10) < 5) || (parseInt(alive, 10) > 60))) {
            res.status(400).send(intGetResErr('invalid alive time - min 5 - max 60', constants.ErrorInvalidAliveTime));
            return false;
        } else {
            return true;
        }
    },
    isValidPageSize: function (pagesize, res) {
        if ((pagesize !== undefined) && ((!myIntIsInteger(pagesize)) || (parseInt(pagesize, 10) < 1000) || (parseInt(pagesize, 10) > 30000))) {
            res.status(400).send(intGetResErr('invalid page size - min 1000 - max 30000', constants.ErrorInvalidPageFormat));
            return false;
        } else {
            return true;
        }
    },
    getBoolean: function (value) {
        return (value !== undefined) && (value === 'true');
    },
    isValidJSONSchema: function (msg, schema) {
        let validate = ajv.compile(schema);
        let valid = validate(msg);
        if (!valid) {
            let jsonParsingErrors = 0;
            if (Array.isArray(validate.errors)) {
                validate.errors.forEach(function (message) {
                    jsonParsingErrors += 1;
                    if (jsonParsingErrors <= 100) {
                        console.log(message.message + " (" + message.dataPath + ")");
                    }
                    if (jsonParsingErrors === 100) {
                        console.log("More than 100 errors. Skipping logging");
                        validate.errors.length = 0;
                    }
                });
            }
        }

        return valid;
    },
    isValidRecordsNumber: function (recordsno, res) {
        if ((recordsno !== undefined) && (myIntIsInteger(recordsno)) && (parseInt(recordsno, 10) > 1)) {
            res.status(400).send(intGetResErr('invalid number of records', constants.ErrorInvalidNumberRecords));
            return false;
        } else {
            return true;
        }
    },
    isValidShortDescription: function (shortdesc, res) {
        if ((shortdesc !== undefined) && (shortdesc.length > 20)) {
            res.status(400).send(intGetResErr('short description too long (max.20 characters', constants.ErrorInvalidShortDescription));
            return false;
        } else {
            return true;
        }
    },
    isValidDate: function (date, res) {

        if ((date !== undefined) && (!isDate(date))) {
            res.status(400).send(intGetResErr('invalid date format', constants.ErrorInvalidDateFormat));
            return false;
        } else {
            return true;
        }
    },
    getResErr: function (text, messagecode) {
        return intGetResErr(text, messagecode);
    },
    getDBschema: function () {
        return process.env.DATABASE_SCHEMA || 'public';
    },
    replaceSchema: function (sql) {
        return sql.replaceAll('$$SCHEMANAME$$', process.env.DATABASE_SCHEMA || 'public');
    },
    getFirstDayOfWeek: function () {
        return 1;
    },
    getFirstWeekOfYear: function () {
        return 1;
    }
};