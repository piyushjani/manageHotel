const Conflict = 409;
const Internal_Server_Error = 500;
const OK = 200;
const Not_Implemented = 501;
const Bad_Request = 400;
const Updated_OK = 200;
const ExtendedLevel = 1;
const Validation_Error = 422;

var dataTypes = {
    bool: 0,
    number: 1,
    string: 2,
    array: 3,
    object: 4,
    positiveNumber: 5,
};


var consumerRequiredFields = {
    id: { type: 'number', error: 'id must be a number' },
    mobile: { type: 'number', error: 'mobile must be number' },
    first_name: { type: 'string', error: 'first_name must be string' },
    last_name: { type: 'string', error: 'last_name must be string' },
    email: { type: 'string', error: 'Please enter valid email' }
    
};

var hotelRequiredFields = {
    id: { type: 'number', error: 'id must be a number' },
    name: { type: 'string', error: 'name must be string' },
    description: { type: 'string', error: 'description must be string' }
    
};

var exports = module.exports = {
    consumerRequiredFields: consumerRequiredFields,
    hotelRequiredFields: hotelRequiredFields,
    dataTypes: dataTypes,
    Conflict: Conflict,
    Internal_Server_Error: Internal_Server_Error,
    OK: OK,
    Not_Implemented: Not_Implemented,
    Bad_Request: Bad_Request,
    Updated_OK: Updated_OK,
    Validation_Error: Validation_Error
    
};