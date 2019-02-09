'use strict';
var validator = require('validator');

require('../application/messages');
var constants = require('../../server/application/constants');


function Consumer(data) {
	this.first_name = data.first_name;
	this.last_name = data.last_name;
	this.mobile = data.mobile;
	this.email = data.email;
	
};

var validationHelper = require('../../server/application/validateUserData');


module.exports = function(Consumer) {

var app = require('../../server/server');

  Consumer.disableRemoteMethod("create", true);
  Consumer.disableRemoteMethod("upsert", true);
  Consumer.disableRemoteMethod("updateAll", true);
  Consumer.disableRemoteMethod("updateAttributes", false);
  //Consumer.disableRemoteMethod("find", true);
  Consumer.disableRemoteMethod("findById", true);
  Consumer.disableRemoteMethod("findOne", true);
  Consumer.disableRemoteMethod("deleteById", true);
  Consumer.disableRemoteMethod("confirm", true);
  Consumer.disableRemoteMethod("count", true);
  Consumer.disableRemoteMethod("exists", true);
  Consumer.disableRemoteMethod("resetPassword", true);
  Consumer.disableRemoteMethod("createChangeStream", true);
  Consumer.disableRemoteMethod("upsertWithWhere", true);
  Consumer.disableRemoteMethod("replaceOrCreate", true);
  Consumer.disableRemoteMethod("replaceById", true);

  
  Consumer.createConsumer=function(data,cb){

  	console.log(data);
  	//return
	var responseData = {};
	if(Object.getOwnPropertyNames(data).length === 0){
		resp = response.jsonResponse(500,messages.consumerMsg.createConsumer,null);
		cb(null,resp);
	} else {


	var consumerObj = new Consumer(data);	

  		Consumer.findOne({
					where: {
						mobile: consumerObj.mobile
					}
				},function(err,res){
					if(err) {
						throw err;
					}
					//if the voucher already exists
					if(res) {
						var err = new Error();
						err.message = 'There is already an Entry with the same Mobile!!'
						err.status = 400;
						
						return cb(err, null);
					} else {
						console.log('identical consumer exist already')
						Consumer.create({
							first_name: consumerObj.first_name, 
							last_name: consumerObj.last_name,
							mobile: consumerObj.mobile,
							email: consumerObj.email,
							updated_at: new Date(),
							created_at: new Date()
							
						},function(err,data){
							if(err) {
								console.log('error in creating consumer')
								cb(null,err);
							}else {
								console.log('consumer created successfully')
								responseData.data = data;
								responseData.status = constants.OK;
								responseData.message = "success";
								responseData.success = 1;
								cb(null,responseData);
							}
						});
					}
			   	});

		}	

	}


Consumer.remoteMethod('createConsumer',
    {
		description: 'Create new Consumer ',
		http: {path:'/' , verb: 'post'},
		accepts: [{arg: 'data', type: 'object', http: { source: 'body' }}],
		returns: {arg: 'res',root: true, type: 'string',http: { source: 'res' }}
	});





/*  Update Consumer */

Consumer.updateConsumer=function(data,cb){
	
   	var responseData = {};
   	/*
	   **check if the requested object is empty
   	*/
	if(Object.getOwnPropertyNames(data).length === 0) {
		resp = response.jsonResponse(500,"Please Enter Details to Update Consumer",null);
		cb(null,resp);
	} else {
	
		/*
		   **find consumer based on mobile
		*/
	    Consumer.findOne({where: {mobile: data.mobile }},function(err,consumer){
		    if(err) {
		    	console.log('error in finding consumer')
		    	console.log(err)
		    	return cb(null, err);	
		    } else {
			    if(!consumer) {
					responseData.data = null;
					responseData.status = constants.OK;
					responseData.message = messages.consumerMsg.consumerUpdateFail;
					responseData.success = 0;
					return cb(null,responseData);
				} else {	
			    	
				    	console.log('update consumer in progress')
				    	var requestConsumerObj = Consumer(data);
				    	var updateColumn = {};

				    	var invalid = false;
						var details = {};

						console.log(requestConsumerObj);
				    	
				    	//first_name
						if(requestConsumerObj.first_name != undefined && requestConsumerObj.first_name != '') {
							updateColumn.first_name = validator.trim(validator.escape(requestConsumerObj.first_name.toString()));
							//updateColumn.first_name = updateColumn.first_name.replace(/  +/g, ' ');
						}

						//last_name
						if(requestConsumerObj.last_name != undefined && requestConsumerObj.last_name != '') {
							updateColumn.last_name = validator.trim(validator.escape(requestConsumerObj.last_name.toString()));
							//updateColumn.last_name = updateColumn.last_name.replace(/  +/g, ' ');
						}
						
						//email
						if(requestConsumerObj.email != undefined) {
							updateColumn.email = requestConsumerObj.email;
							if(!validator.isEmail(requestConsumerObj.email)) {
								invalid = true;
								details.email = messages.consumerMsg.emailInvalid;
							}
						}
						

						var requestObjectCheck = validationHelper.validateRequest(updateColumn,constants.consumerRequiredFields);
						console.log(requestObjectCheck);
						
						if(requestObjectCheck) {
							return cb(requestObjectCheck,null);
						} else {					
							if(invalid){
								console.log('invalid');
								return cb(app.buildError('Error', constants.Bad_Request, messages.consumerMsg.invalidConsumerUpdateRequest, constants.Bad_Request, details));
							} else {
								
											
										
									updateColumn.updated_at = new Date();

									console.log('updateColumn');	
									console.log(updateColumn);
									
									Consumer.update({id: consumer.getId()}, updateColumn, function(err,data){
										if(err) 
											return cb(null, err);
										else {
											if(data) {
												//cb(null,data);
												responseData.data = data;
												responseData.status = constants.OK;
												responseData.message = "success";
												responseData.success = 1;
												return cb(null,responseData);
											}
										}
									});
										
										
							}	
						}	
			    				
				}
			}	 
		});
	    
	}
};

Consumer.remoteMethod('updateConsumer', {
	description: 'Update Consumer',
	accepts: {
		arg:'data', type: 'object', http: {source: 'body'}
	},
	http: {path: '/', verb: 'put'},
	returns: {
		root: true, type: 'object'
	}
});


/*  Delete Consumer */

	var app = require('../../server/server');
	var responseData = {};

	Consumer.deleteConsumer = function(consumerId,cb) {
    if(consumerId!=undefined  || consumerId!=null ) {
	    var consumerId = consumerId;

      	Consumer.findOne({where: {id: consumerId }},function(err,consumer){
      		console.log(consumer);
        	if(err) {
        		cb(null, err);
    		}
    		if(consumer) {
    			var consumerId = consumer.getId();
        		//console.log(voucherId);
        		Consumer.destroyById(consumerId,function(err,data) {
        			if(err) { 
        				cb(null, err);
	        		}	
	        		if(data){
        				
						responseData.data = data;
						responseData.status = constants.OK;
						responseData.message =  "success";
						responseData.success = 1;
						cb(null,responseData);
	        		}
        		});
    		}
    		else {
	            responseData.data = null;
	            responseData.status = constants.OK;
	            responseData.message = "Please Enter valid Consumer ID";
	            responseData.success = 0;
	            cb(null,responseData);
        	}  
        });
    } else {
		responseData.data = null;
		responseData.status = constants.OK;
		responseData.message = "Please Enter valid Consumer ID";
		responseData.success = 0;
		cb(null,responseData);
    }
};


Consumer.remoteMethod('deleteConsumer',
{
	description: 'Delete Consumer by  consumer id',
	http: {path:'/' , verb: 'delete'},
	accepts: [{arg: 'consumerId', type: 'number'}],
	returns: {arg: 'res',root: true, type: 'string',http: { source: 'res' }}

});







};
