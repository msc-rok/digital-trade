'use strict';

 function isNull (x) {
  return x === null;
}
function isUndefined(x) {
  return x === void 0;
}
 function isEmpty(x) {
  return x.hasOwnProperty('length') && x.length === 0;
}

var util = {
  guid: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  },

  isNull: function  (x) { 
    return isNull(x); 
  },
  isUndefined: function (x) {
    return isUndefined(x);
  },
  isEmpty: function (x) {
    return isEmpty(x);
  },
  isNullOrUndefined: function (x) {
    return isNull(x) || isUndefined(x);
  },
  isNullUndefinedOrEmpty: function (x) {
    return isNull(x) || isUndefined(x) || isEmpty(x);
  },
  formatDateToDBDate: function (d) {
    return d.getFullYear().toString() + (('0' + (d.getMonth() + 1)).slice(-2)) + (('0' + d.getDate()).slice(-2));
  }, 
  joinKeys: function() { /* Joins all parameters with ':' and returns the string. */
    return Array.prototype.slice.call(arguments).join(':').toLowerCase();
  },
  formatRedisKey: function (key) {
    if (key % 1 === 0) {
      key = parseInt(key) + '.0';
    }
    return key;
  }

};
module.exports.Util = util;