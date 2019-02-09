const Conflict = 409;
const Internal_Server_Error = 500;
const OK = 201;
const Not_Implemented = 501;
const Bad_Request = 400;
const Updated_OK = 200;
var exports = module.exports = {
  Conflict: Conflict,
  Internal_Server_Error: Internal_Server_Error,
  OK: OK,
  Not_Implemented: Not_Implemented,
  Bad_Request: Bad_Request,
  Updated_OK: Updated_OK
};

exports.jsonResponse = function(status, message, data){
    var response = {
        status : status,
        message : message,
        data : data
    }
    return response;
};
