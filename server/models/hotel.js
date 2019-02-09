'use strict';

var validator = require('validator');

require('../application/messages');
var constants = require('../../server/application/constants');


function Hotel(data) {
  this.name = data.name;
  this.description = data.description;
  this.created_at = new Date();
  this.updated_at = new Date();
  
  
};

var validationHelper = require('../../server/application/validateUserData');



module.exports = function(Hotel) {
  Hotel.disableRemoteMethod("create", true);
  Hotel.disableRemoteMethod("upsert", true);
  Hotel.disableRemoteMethod("updateAll", true);
  Hotel.disableRemoteMethod("updateAttributes", false);
  //Hotel.disableRemoteMethod("find", true);
  Hotel.disableRemoteMethod("findById", true);
  Hotel.disableRemoteMethod("findOne", true);
  Hotel.disableRemoteMethod("deleteById", true);
  Hotel.disableRemoteMethod("confirm", true);
  Hotel.disableRemoteMethod("count", true);
  Hotel.disableRemoteMethod("exists", true);
  Hotel.disableRemoteMethod("resetPassword", true);
  Hotel.disableRemoteMethod("createChangeStream", true);
  Hotel.disableRemoteMethod("upsertWithWhere", true);
  Hotel.disableRemoteMethod("replaceOrCreate", true);
  Hotel.disableRemoteMethod("replaceById", true);


  Hotel.createHotel=function(data,cb){

      //console.log(data);
      //return
      var responseData = {};
      if(Object.getOwnPropertyNames(data).length === 0){
        resp = response.jsonResponse(500,messages.hotelMsg.createHotel,null);
        console.log('dasdasdasd')
        cb(null,resp);
      } else {


      var hotelObj = new Hotel(data); 

          Hotel.findOne({
              where: {
                name: hotelObj.name
              }
            },function(err,res){
                if(err) {
                  throw err;
                }
                //if the voucher already exists
                if(res) {
                  var err = new Error();
                  err.message = 'There is already an Entry with the same Hotel Name!!'
                  err.status = 400;
                  
                  return cb(err, null);
                } else {
                  Hotel.create({
                    name: hotelObj.name, 
                    description: hotelObj.description,
                    updated_at: new Date(),
                    created_at: new Date()
                    
                  },function(err,data){
                    if(err) {
                      console.log('error in creating hotel')
                      cb(null,err);
                    }else {
                      console.log('hotel created successfully')
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


  Hotel.remoteMethod('createHotel',
      {
      description: 'Create new Hotel ',
      http: {path:'/' , verb: 'post'},
      accepts: [{arg: 'data', type: 'object', http: { source: 'body' }}],
      returns: {arg: 'res',root: true, type: 'string',http: { source: 'res' }}
    });



  /*  Update Hotel */

  Hotel.updateHotel=function(data,cb){
    
      var responseData = {};
      /*
       **check if the requested object is empty
      */
    if(Object.getOwnPropertyNames(data).length === 0) {
      resp = response.jsonResponse(500,"Please Enter Details to Update Hotel",null);
      cb(null,resp);
    } else {
    
      /*
         **find consumer based on mobile
      */
        Hotel.findOne({where: {id: data.id }},function(err,hotel){
          if(err) {
            console.log('error in finding consumer')
            console.log(err)
            return cb(null, err); 
          } else {
            if(!hotel) {
            responseData.data = null;
            responseData.status = constants.OK;
            responseData.message = messages.hotelMsg.hotelUpdateFail;
            responseData.success = 0;
            return cb(null,responseData);
          } else {  
              
                console.log('update hotel in progress')
                var requestHotelObj = Hotel(data);
                var updateColumn = {};

                var invalid = false;
              var details = {};

              console.log(requestHotelObj);
                
              //description
              if(requestHotelObj.description != undefined && requestHotelObj.description != '') {
                updateColumn.description = validator.trim(validator.escape(requestHotelObj.description.toString()));
              }
              
              var requestObjectCheck = validationHelper.validateRequest(updateColumn,constants.hotelRequiredFields);
              console.log(requestObjectCheck);
              
              if(requestObjectCheck) {
                return cb(requestObjectCheck,null);
              } else {          
                if(invalid){
                  console.log('invalid');
                  return cb(app.buildError('Error', constants.Bad_Request, messages.hotelMsg.invalidHotelUpdateRequest, constants.Bad_Request, details));
                } else {
                  
                        
                      
                    updateColumn.updated_at = new Date();

                    console.log('updateColumn');  
                    console.log(updateColumn);
                    
                    Hotel.update({id: hotel.getId()}, updateColumn, function(err,data){
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

  Hotel.remoteMethod('updateHotel', {
    accepts: {
      arg:'data', type: 'object', http: {source: 'body'}
    },
    http: {path: '/', verb: 'put'},
    returns: {
      root: true, type: 'object'
    }
  });


  /*  Delete Hotel */

  var app = require('../../server/server');
  var responseData = {};

  Hotel.deleteHotel = function(hotelId,cb) {
    //console.log(vendorCode+voucherCode+'fdgfd');
    if(hotelId!=undefined  || hotelId!=null ) {
      var hotelId = hotelId;

        Hotel.findOne({where: {id: hotelId }},function(err,hotel){
          console.log(hotel);
        if(err) {
            cb(null, err);
        }
        if(hotel) {
          var hotelId = hotel.getId();
            //console.log(voucherId);
            Hotel.destroyById(hotelId,function(err,data) {
              if(err) { 
                cb(null, err);
              } 
              if(data){
                  // voucher.statusCode = 200;
                  //cb(null,data);
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
            responseData.message = "Please Enter valid Hotel ID";
            responseData.success = 0;
            cb(null,responseData);
        } 
        });
    } else {
    responseData.data = null;
    responseData.status = constants.OK;
    responseData.message = "Please Enter valid Hotel ID";
    responseData.success = 0;
    cb(null,responseData);
    }
};


Hotel.remoteMethod('deleteHotel',
{
  description: 'Delete Hotel by  consumer id',
  http: {path:'/' , verb: 'delete'},
  accepts: [{arg: 'hotelId', type: 'number'}],
  returns: {arg: 'res',root: true, type: 'string',http: { source: 'res' }}

});

};





