'use strict';

var errorHandler = require('./utils/errorHandler');
var validateRequest = require('./utils/validateRequest');
var getTransactionId = require('./utils/getTransactionId');
var sendInvalidJSON = require('./utils/sendInvalidJSON');
var paging = require('../common/paging');
var Measures = require('../common/measuredata').Measures;

module.exports = function (request, response, next) {
    var txid = getTransactionId(request);    
    logger.startTransaction(txid);
    logger.debug(logmessages['WS1000'].code, logmessages['WS1000'].message, JSON.stringify(request.headers));

    var totalPerfHandler = logger.startPerformanceLog('Total time for /ACSF/Promotion/GetMeasures');  

    try {

        var body = request.body;


        logger.debug(logmessages['WS1001'].code, logmessages['WS1001'].message, JSON.stringify(body));

        /*Check if all required attributes are set in the request body */

        var requiredAttributes = ['kpisetid', 'promotionid', 'accountid', 'datefrom', 'datethru', 'commitdate', 'firstdayofweek', 'firstweekofyear', 'productgrouplevel', 'considerlisting', 'tactics'];
        var bValid = validateRequest(body, requiredAttributes);


        if (bValid) {


            Measures.getMeasuresForPromotion(body, function (err, result) {
            if (err) {
                return errorHandler(err, request, response, next, totalPerfHandler);
            }
            
            var resultstring = JSON.stringify(result);
            paging.paginate(resultstring, function(err, paginateresult) {
                if(err) {
                logger.error(err);
                return errorHandler(err, request, response, next, totalPerfHandler);
                }
                logger.debug(logmessages['WS1003'].code, logmessages['WS1003'].message, paginateresult);         
                logger.endPerformanceLog(totalPerfHandler);
                logger.endTransaction();
                response.send(paginateresult);
            });

            

            });

        } else {      
            /*Send error response when JSON is invalid*/
            sendInvalidJSON(body, request, response, next, totalPerfHandler);
        }
    } catch (e) {
        errorHandler(e.message, request, response, next, totalPerfHandler);
    }
};