'use strict';

/* globals logger, logmessages, config, util */

var database = require('./db');
var schemaName = config('DATABASE_SCHEMA');

var namespacePrefix = config('NAMESPACE_PREFIX') || '';
//columns are always lowercase in database
if(namespacePrefix.toLowerCase) {
  namespacePrefix = namespacePrefix.toLowerCase();
}

var async = require('async');

function Measures() { }

/* Gets first found Calculation Configuration JSON */
Measures.getCalculationConfig = function (kpisetid, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get Calculation Configuration');
  var query = `SELECT ${namespacePrefix}configuration__c as configuration__c  
                FROM ${schemaName}.${namespacePrefix}kpi_set__c k 
                WHERE k.sfid='${kpisetid}' limit 1`;  
  logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, query);                
  database.submit(query, [], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeklyMeasuresInt5 = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeklyMeasureInt5 for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getweeklymeasuresint5', parameter: in_json });                
  database.submit('SELECT * FROM ' + schemaName + '.getweeklymeasuresint5($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeklyMeasuresReal5 = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeklyMeasureReal5 for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getweeklymeasuresreal5', parameter: in_json });                
  database.submit('SELECT * FROM ' + schemaName + '.getweeklymeasuresreal5($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeklyMeasuresInt20 = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeklyMeasureInt20 for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getweeklymeasuresint20', parameter: in_json });           
  database.submit('SELECT * FROM ' + schemaName + '.getweeklymeasuresint20($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeklyMeasuresReal20 = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeklyMeasureReal20 for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getweeklymeasuresreal20', parameter: in_json });           
  database.submit('SELECT * FROM ' + schemaName + '.getweeklymeasuresreal20($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeklyMeasuresInt54 = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeklyMeasureInt54 for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getweeklymeasuresint54', parameter: in_json });           
  database.submit('SELECT * FROM ' + schemaName + '.getweeklymeasuresint54($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeklyMeasuresReal54 = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeklyMeasureReal54 for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getweeklymeasuresreal54', parameter: in_json });           
  database.submit('SELECT * FROM ' + schemaName + '.getweeklymeasuresreal54($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeksForTimeFrame = function (startdate, enddate, firstdayofweek, firstweekofyear, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeksForTimeFrame');
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getWeeksForTimeFrame', startdate: startdate, enddate: enddate, firstdayofweek: firstdayofweek, firstweekofyear: firstweekofyear});             
  database.submit('SELECT * FROM ' + schemaName + '.getWeeksForTimeFrame($1,$2,$3,$4)', [startdate, enddate, firstdayofweek, firstweekofyear], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
        if (err) { return cb(err); }
        cb(err, result);
    });
};

Measures.isTimeFrameOverlappingCalendarYear = function (startdate, enddate, firstdayofweek, firstweekofyear, offsets, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get TimeFrameOverlappingCalendarYear');
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'isTimeFrameOverlappingCalendarYear', startdate, enddate: enddate, firstdayofweek: firstdayofweek, firstweekofyear: firstweekofyear, offsets: offsets });           
  database.submit('SELECT * FROM ' + schemaName + '.isTimeFrameOverlappingCalendarYear($1,$2,$3,$4,$5)', [startdate, enddate, firstdayofweek, firstweekofyear, offsets], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) { return cb(err); }
    cb(err, result);
  });
};

Measures.getProductMeasure = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get ProductMeasure for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getproductmeasures', parameter: in_json });           
  database.submit('SELECT * FROM ' + schemaName + '.getproductmeasures($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getAccountProductMeasure = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get AccountProductMeasure for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getaccountproductmeasures', parameter: in_json });           
  database.submit('SELECT * FROM ' + schemaName + '.getaccountproductmeasures($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getAccountMeasure = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get AccountMeasure for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getaccountmeasures', parameter: in_json });           
  database.submit('SELECT * FROM ' + schemaName + '.getaccountmeasures($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getWeeklyPromotionMeasureResultSum = function (in_json, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get WeeklyPromotionMeasureResultSum for measure ' + in_json.measurecode);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getweeklypromotionmeasureresultsum', parameter: in_json });
  database.submit('SELECT * FROM ' + schemaName + '.getweeklypromotionmeasureresultsum($1)', [in_json], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

Measures.getPromotionKPIs = function(promotionid,measures,cb){
  var logPerfHandler = logger.startPerformanceLog('Time to get Promotion KPIs');
  var query = `SELECT promotionid , tacticid , measurecode as measure, max(total) total FROM ${schemaName}.weeklypromotionmeasureresult k 
               WHERE k.promotionid = '${promotionid}' 
                and measurecode in ('${measures.join("','")}') 
                and productid is null 
               GROUP BY promotionid,tacticid,measurecode 
               ORDER BY measurecode`;
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, query);
  database.submit(query, [], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

/*
  @param id: promotion id (sfdc)
*/
Measures.deletePromotionMeasuresWeekly = function (id, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to delete WeeklyPromotionMeasures');
  var deletequery = `DELETE FROM ${schemaName}.weeklypromotionmeasureresult p WHERE p.promotionid = $1 `;
  logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, { query: deletequery, id: id });
  database.submit(deletequery, [id], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

/*
  @param table: name of table to write back data
  @param columns: name of columns the data is ordered by
  @param data: string in csv format with actual data
*/
Measures.writeBackMeasuresWeekly = function (writebackdata, cb) {
	var id = writebackdata.id;
  var aggregationcategory = writebackdata.aggregationcategory;
	var startweek = writebackdata.startweek;
	var endweek = writebackdata.endweek;
	var startyear = writebackdata.startyear;
	var endyear = writebackdata.endyear;
	var bOverlaps = false;
	if (startyear !== endyear) {
	  bOverlaps = true;
	}

	var firstweekofyear = writebackdata.firstweekofyear;
	var firstdayofweek = writebackdata.firstdayofweek;

	var dataRows = writebackdata.data;
	var row, idxDataRows;

	var products = [];
	for (idxDataRows = 0; idxDataRows < dataRows.length; idxDataRows++) {
	  row = dataRows[idxDataRows];
	  if (row.Product) {
		products.push(row.Product);
	  }
	}

	/*get productids and year ids from db */
	var stringproducts = JSON.stringify(products);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getproductandyearmaps', products: stringproducts, startyear: startyear, endyear: endyear, firstdayofweek: firstdayofweek, firstweekofyear: firstweekofyear });
  var dbgetproductandyearmapsPerfHandler = logger.startPerformanceLog('Time to get product and year info');               
	database.submit('SELECT * FROM ' + schemaName + '.getproductandyearmaps($1,$2,$3,$4,$5)', [stringproducts, startyear, endyear, firstdayofweek, firstweekofyear], function (err, result) {
    logger.endPerformanceLog(dbgetproductandyearmapsPerfHandler);
    if (err) {
      logger.error(logmessages['DBQUERY0005'].code, logmessages['DBQUERY0005'].message, err);
		return cb(err);
	  }

	  if (result.length > 0) {
		var oResult = JSON.parse(result[0].getproductandyearmaps);
		/*productsfid -> productinternalid*/
		var productidmap = oResult.productidmap;
		/*calendaryear -> periodid */
		var periodyearmap = oResult.periodyearmap;

		var csv = [];
		var csvMetaData = [];

		var csvWeekDataInitial = [];
		/*Total Column and Week1 to Week54 */
		for (var i = 0; i < 55; i++) {
		  csvWeekDataInitial.push(null);
		}

		var csvWeekData = [];
		var idxData, idxYear, idxWeek, yearstartweek, yearendweek, csvYearMetaData;
		for (idxDataRows = 0; idxDataRows < dataRows.length; idxDataRows++) {
		  row = dataRows[idxDataRows];
		  csvMetaData = [id];
      if(!util.isNullOrUndefined(aggregationcategory)) {
        csvMetaData.push(aggregationcategory);
      } else {
        csvMetaData.push(null);
      }
		  if (row.Measure) {
			  csvMetaData.push(row.Measure);
		  } else {
			  csvMetaData.push(null);
		  }
		  if (row.Tactic) {
			  csvMetaData.push(row.Tactic);
		  } else {
			  csvMetaData.push(null);
		  }
		  if (row.Product) {
			  csvMetaData.push(productidmap[row.Product]);  /* Resolve sfid to internalid */
		  } else {
		  	csvMetaData.push(null);
		  }

		  if (row.data && row.data.length > 0) {

        if (bOverlaps) {  /* data overlaps over a year */
          idxData = 1;
          for (idxYear = startyear; idxYear <= endyear; idxYear++) {
          csvWeekData = csvWeekDataInitial.slice(0); /* copy initial array */
          csvWeekData[0] = row.data[0]; /* total column */

          if (idxYear === startyear) {
            yearstartweek = startweek;
          } else {
            yearstartweek = 1;
          }
          if (idxYear === endyear) {
            yearendweek = endweek;
          } else {
            yearendweek = periodyearmap[idxYear].weeks;
          }

          for (idxWeek = yearstartweek; idxWeek <= yearendweek; idxWeek++) {    
            csvWeekData[idxWeek] = row.data[idxData];
            idxData++;
          }
          csvYearMetaData = csvMetaData.slice(0);
          csvYearMetaData.push(periodyearmap[idxYear].id); 
          csv.push(csvYearMetaData.concat(csvWeekData).join(';'));
          }

        } else { /* data does not overlap over a year */
          idxData = 0;
          csvWeekData = csvWeekDataInitial.slice(0); /* copy initial array */
          csvWeekData[0] = row.data[0]; /* total column */
          idxData = 1; /* startweek is index 1 */
          for (idxWeek = startweek; idxWeek <= endweek; idxWeek++) {
          csvWeekData[idxWeek] = row.data[idxData];
          idxData++;
          }

          csvMetaData.push(periodyearmap[startyear].id); /*** todo periodid ***/
          csv.push(csvMetaData.concat(csvWeekData).join(';'));

        }

		  } else {
			  continue; /*no data -> no need to write back */
		  }
		}

		if (csv.length === 0) { /* no data to write back */
		  cb(err, result);
		} else {
		  var table = schemaName + '.weeklypromotionmeasureresult';
		  /*promotionid, aggregationcategory, measurecode, tacticid, productid, periodid, total, week1, ... , week54*/
		  var columns = 'promotionid, aggregationcategory, measurecode, tacticid, productid, periodid, total, week1, week2, week3, week4, week5, week6, week7, week8, week9, week10, week11, week12, week13, week14, week15, week16, week17, week18, week19, week20, week21, week22, week23, week24, week25, week26, week27, week28, week29, week30, week31, week32, week33, week34, week35, week36, week37, week38, week39, week40, week41, week42, week43, week44, week45, week46, week47, week48, week49, week50, week51, week52, week53, week54';

		  logger.debug(logmessages['DBQUERY0003'].code, logmessages['DBQUERY0003'].message, table);   
      var dbwritebackPerfHandler = logger.startPerformanceLog('Time to insert writeback data', {table});      
		  database.insert(table, columns, csv.join('\r\n'), ';', '', function (err, result) {
        logger.endPerformanceLog(dbwritebackPerfHandler);

        if (err) { return cb(err); }
        cb(err, result);
			
		  });
		}
    } else {
      logger.error(logmessages['DBQUERY0005'].code, logmessages['DBQUERY0005'].message);
      cb(new Error(logmessages['DBQUERY0005'].message));
	  }
	});
};



function PromotionCache() {
}

PromotionCache.findById = function (promotionId, cb) {  
    
  var cbWithContext = function (err, results) {
    if (err) {
      logger.error(promotionId, err);
      return cb(err);
    }
    if (!!results && results.length !== 1) {
      logger.error(logmessages['DBQUERY0004'].code, logmessages['DBQUERY0004'].message, { expected: 1, actual: results.length });          
      return cb(new Error(logmessages['DBQUERY0004'].message));
    }

    var promotionDbCacheObject = results[0].content;    
    cb(null, promotionDbCacheObject);

  };
  var query = `SELECT content FROM ${schemaName}.promotioncache where promotionid=$1`;
  logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, { query: query, promotionid: promotionId }); 
  database.submit(query, [promotionId], cbWithContext);
};

PromotionCache.upsert = function (promotionId, content, lastmodified, anchorsfid, promotiontemplate, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to upsert PromotionCache ');
  var d = util.formatDateToDBDate(lastmodified);
  //var query = 'INSERT INTO ' + schemaName + '.promotioncache (promotionid, content, lastmodified, anchorsfid) VALUES (\'' + promotionId + '\', \'' + d + '\', \'' + content + '\', \'' + anchorsfid + '\') ON CONFLICT (promotionid) DO UPDATE SET content = \'' + content + '\', lastmodified = \'' + d + '\', anchorsfid = \'' + anchorsfid + '\'';
  var query = 'SELECT ' + schemaName + '.upsertpromotioncache($1,$2,$3,$4,$5)';


  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { query: query, promotionid: promotionId, content: content, lastmodified: d, anchor: anchorsfid, template: promotiontemplate });    

  database.submit(query, [promotionId, content, d, anchorsfid, promotiontemplate], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }    
    cb(err, result);
  });

};


PromotionCache.classifyByActions = function (sfPromotions, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get Promotions to calculate/update ');
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'getModifiedOrNewPromotions', numPromos: sfPromotions.length });

  database.submit('SELECT * FROM ' + schemaName + '.getModifiedOrNewPromotions($1)', [JSON.stringify(sfPromotions)], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result[0].getmodifiedornewpromotions);
  });
};

PromotionCache.deleteMultipleById = function (promotionIds, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get Promotions to calculate/update ');

  async.each(
    promotionIds,
    function (promotionId, done) {
      var query = `DELETE FROM ${schemaName}.promotioncache WHERE promotionid=$1`;
      logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, { query: query });
      database.submit(query, [promotionId], function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
    },
    function (err) {
      logger.endPerformanceLog(logPerfHandler);
      cb(err);
    }
  );
};

PromotionCache.updateProductIds = function(promotionid, productids, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to update PromotionCache Products');
  var stringProducts = JSON.stringify(productids);
  var query = `WITH productids AS (SELECT json_array_elements_text('${stringProducts}'))   
                UPDATE ${schemaName}.promotioncache pc SET productids = ARRAY(
                      SELECT pid.internalid 
                      FROM ${schemaName}.productid pid, productids 
                      WHERE pid.sfid = productids.json_array_elements_text) 
                WHERE pc.promotionid = $1`;
  
  logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, { query: query, promotionid: promotionid, products: stringProducts});   
  database.submit(query, [promotionid], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }    
    cb(err, result);
  });
};

PromotionCache.getFilteredPromotions = function(filter, ids, cb) {
  var query = `SELECT promotionid FROM ${schemaName}.promotioncache`;
    var conditions = [];

    filter = filter.filtercriteria || {};

    if(filter.timefilter){
        let dateFrom = (new Date(filter.timefilter.datefrom || 0)).toISOString().slice(0,10);
        let dateThru = (new Date(filter.timefilter.datethru || 1e14)).toISOString().slice(0,10);

        conditions.push(`to_date(content->>'datefrom', 'YYYY-MM-DD') <= '${dateThru}' AND to_date(content->>'datethru', 'YYYY-MM-DD') >= '${dateFrom}'`);
    }

    if(filter.accountfilter && (filter.accountfilter.account || {}) instanceof Array && filter.accountfilter.account.length){
        let accountIds = `['${filter.accountfilter.account.map(escapeIt).join("','")}']`;
        conditions.push(`ARRAY[(content->>'accountid')]::varchar[] <@ ARRAY${accountIds}::varchar[]`);
    }

    if(filter.promotiontemplatefilter && (filter.promotiontemplatefilter.promotiontemplates || {}) instanceof Array && filter.promotiontemplatefilter.promotiontemplates.length){
        let templates = `['${filter.promotiontemplatefilter.promotiontemplates.map(escapeIt).join("','")}']`;
        conditions.push(`ARRAY[template]::varchar[] <@ ARRAY${templates}::varchar[] `);
    }

    if(filter.tactictemplatefilter && (filter.tactictemplatefilter.tactictemplates || {}) instanceof Array && filter.tactictemplatefilter.tactictemplates.length){
        let templates = `['${filter.tactictemplatefilter.tactictemplates.map(escapeIt).join("','")}']`;
        conditions.push(`EXISTS(
            SELECT 1 FROM jsonb_to_recordset(content->'tactics') as x(tactictemplateid varchar)
            WHERE ARRAY[tactictemplateid]::varchar[] <@ ARRAY${templates}::varchar[]
        )`);
    }

    if(ids && ids instanceof Array){
        conditions.push(`productids::varchar[] && ARRAY${ JSON.stringify(ids) }::varchar[]`);
    }

    if(conditions.length) {query += ' WHERE ' + conditions.join(' AND ');}
      var logPerfHandler = logger.startPerformanceLog('Time to update get Filtered Promotions from Cache');
    logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, { query: query});   

    database.submit(query,[],function(err, result){
       logger.endPerformanceLog(logPerfHandler);
        if(err) { cb(err);}
        cb(err, result.map(row => row.promotionid));
    });
};

function escapeIt(str){
    str = (str || '') + '';
    return str.replace(/'/g,'');
}

function ProductQuery() { }

/*
	Gets all products
*/
ProductQuery.getAllProducts = function (cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get all Products');
    
  var query = `SELECT ${schemaName}.productid.internalid AS internalid, ${schemaName}.${namespacePrefix}product__c.*  
   
               FROM ${schemaName}.${namespacePrefix}product__c 
                  INNER JOIN ${schemaName}.productid ON ${schemaName}.productid.sfid = ${schemaName}.${namespacePrefix}product__c.sfid 
               WHERE ${schemaName}.${namespacePrefix}product__c.isdeleted = false  
                AND ${schemaName}.${namespacePrefix}product__c.${namespacePrefix}product_level__c = 'Product'`;

  logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, query);   
  database.submit(query, [], function (err, results) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, results);
  }
  );
};

/*
 * Resolve product groups for given set of products
 */
ProductQuery.resolveProductGroups = function (products, grouplevel, referencedate, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get resolve Product Groups');
  var stringproducts = JSON.stringify(products);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'resolveproductgroups', products: stringproducts, grouplevel: grouplevel, referencedate: referencedate });         
  database.submit('SELECT * FROM ' + schemaName + '.resolveproductgroups($1,$2,$3)', [stringproducts, grouplevel, referencedate], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};

/*
	Inserts a product salesforce id into product__c
*/
ProductQuery.insertProductSFId = function (sfid, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to insert ProductSFId '); 
  var query = `INSERT INTO ${schemaName}.${namespacePrefix}product__c (sfid, id, isdeleted)   
               SELECT $1::varchar(18), (SELECT MAX(id) + 1 FROM ${schemaName}.${namespacePrefix}product__c), false 
               WHERE NOT EXISTS (SELECT sfid FROM ${schemaName}.${namespacePrefix}product__c WHERE sfid = $1::varchar(18)) `;
  logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, { query: query, sfid: sfid });   
  database.submit(query, [sfid], function (err, results) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, results);
  }
	);
};

/*
	Gets the mapping internalid for a given salesforce id
*/
ProductQuery.getIdFromSFId = function (sfid, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to get IdFromSFId');
  var query = `SELECT internalid FROM ${schemaName}.productid WHERE ${schemaName}.productid.sfid = $1::varchar(18) `;
  logger.debug(logmessages['DBQUERY0002'].code, logmessages['DBQUERY0002'].message, { query: query, sfid: sfid });   
  database.submit(query, [sfid], function (err, results) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, results);
  });
};

/*
  Validates that each product has a valid KAM state for the given date
  Returns Map of internalid -> sfid
  */
ProductQuery.validateProducts = function (products, commitDate, cb) {
  var logPerfHandler = logger.startPerformanceLog('Time to validate Products ');
  var stringproducts = JSON.stringify(products);
  logger.debug(logmessages['DBQUERY0001'].code, logmessages['DBQUERY0001'].message, { storedprocedurename: 'validateProducts', products: stringproducts, commitdate: commitDate });         
  var query = '';
  query += 'SELECT * FROM ' + schemaName + '.validateProducts($1,$2)';
  
  database.submit(query, [stringproducts, commitDate], function (err, result) {
    logger.endPerformanceLog(logPerfHandler);
    if (err) {
      return cb(err);
    }
    cb(err, result);
  });
};




module.exports.Measures = Measures;
module.exports.ProductQuery = ProductQuery;
module.exports.PromotionCache = PromotionCache;