var exports = module.exports;
var responseSchema = require('../../server/application/responseSchema');
var constants = require('../../server/application/constants');
var validator = require('validator');

var app = require('../server');

exports.validateRequest = function(requestObject, validObject){
    var validKeys = Object.keys(validObject);
    var requestedKeys = Object.keys(requestObject);
    var invalidKeys = [];
    var invalidDataTypeKeys = [];
    var invalidValue = [];
    var details = {};
    var message = '';

    for(var i=0;i<requestedKeys.length;i++)
    {
        if(validKeys.indexOf(requestedKeys[i]) == -1)
            invalidKeys.push(requestedKeys[i]);
        else
        {
            if(typeof(requestObject[requestedKeys[i]]) != validObject[requestedKeys[i]].type)
                invalidDataTypeKeys.push(requestedKeys[i]);
            if(validObject[requestedKeys[i]].enum != undefined)
            {
                if(validObject[requestedKeys[i]].enum.indexOf(requestObject[requestedKeys[i]]) == -1)
                    invalidValue.push(requestedKeys[i]);
            }
        }
    }

    for(var i=0;i<invalidKeys.length;i++)
        details[invalidKeys[i]] = invalidKeys[i] + ' is not a valid key';
    for(var i=0;i<invalidDataTypeKeys.length;i++)
        details[invalidDataTypeKeys[i]] = validObject[invalidDataTypeKeys[i]].error;
    for(var i=0;i<invalidValue.length;i++)
        details[invalidValue[i]] = invalidValue[i] + "'s value is not valid";  
    if(invalidKeys.length > 0)
        message += 'Some fields are invalid. ';
    if(invalidDataTypeKeys.length > 0)
        message += 'Some fields have invalid data type';
    if(invalidValue.length > 0)
        message += 'Some fields have invalid value';
    if(invalidKeys.length == 0 && invalidDataTypeKeys.length == 0 && invalidValue.length == 0)
        return null;
    else
        return app.buildError('BAD_REQUEST', constants.Bad_Request, message, constants.Bad_Request, details);
};

