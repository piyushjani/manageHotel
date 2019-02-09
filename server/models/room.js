'use strict';

var validator = require('validator');
var async  = require('async');

require('../application/messages');
var constants = require('../../server/application/constants');
var validationHelper = require('../../server/application/validateUserData');


function Room(data) {
  this.room_type = data.room_type;
  this.beds = data.beds;
  this.price = data.price;
  this.hotel_id = data.hotel_id;
  
};

module.exports = function(Room) {
  var app = require('../../server/server');

  Room.disableRemoteMethod("create", true);
  Room.disableRemoteMethod("upsert", true);
  Room.disableRemoteMethod("updateAll", true);
  Room.disableRemoteMethod("updateAttributes", false);
  Room.disableRemoteMethod("find", true);
  Room.disableRemoteMethod("findById", true);
  Room.disableRemoteMethod("findOne", true);
  Room.disableRemoteMethod("deleteById", true);
  Room.disableRemoteMethod("confirm", true);
  Room.disableRemoteMethod("count", true);
  Room.disableRemoteMethod("exists", true);
  Room.disableRemoteMethod("resetPassword", true);
  Room.disableRemoteMethod("createChangeStream", true);
  Room.disableRemoteMethod("upsertWithWhere", true);
  Room.disableRemoteMethod("replaceOrCreate", true);
  Room.disableRemoteMethod("replaceById", true);


  Room.createRoom=function(data,cb){

    console.log(data);
    //return
  var responseData = {};
  if(Object.getOwnPropertyNames(data).length === 0){
    resp = response.jsonResponse(500,messages.consumerMsg.createConsumer,null);
    cb(null,resp);
  } else {


      var roomObj = new Room(data); 

      var invalid = false;
      var details = {};

      //room_type
      if(roomObj.room_type != undefined && roomObj.room_type != null && roomObj.room_type != '') {
            roomObj.room_type = validator.trim(validator.escape(roomObj.room_type.toString()));
      } 

      //beds
      if(roomObj.beds)
          if(!validator.isNumeric(roomObj.beds.toString())) {
            invalid = true;
            details.beds = messages.roomMsg.bedsInvalid;
          }

      //price
      if(roomObj.price != undefined && roomObj.price != null && roomObj.price != '')
          //roomObj.price  = validator.isNumeric(roomObj.price);
          if(!validator.isNumeric(roomObj.price.toString())) {
            invalid = true;
            details.price = messages.roomMsg.priceInvalid;
          }

      //hotel_id
      if(roomObj.hotel_id != undefined && roomObj.hotel_id != null && roomObj.hotel_id != '')

          if(!validator.isNumeric(roomObj.hotel_id.toString())) {
            invalid = true;
            details.hotel_id = messages.roomMsg.hotelIdInvalid;
          }


     if(invalid){
          console.log('invalid');
          return cb(app.buildError('Error', constants.Bad_Request, messages.roomMsg.invalidRoomCreateRequest, constants.Bad_Request, details));
        } else {             
      
              var hotelModel = Room.app.models.Hotel;
                  hotelModel.findOne({where: {id: roomObj.hotel_id} },function(err,hotel){
                    if(err) {
                      throw err;
                    } else {
                      if(hotel) {
                        console.log('hotel')
                        console.log(hotel)
                          Room.create({
                            room_type: roomObj.room_type, 
                            beds: roomObj.beds,
                            price: roomObj.price,
                            hotel_id: roomObj.hotel_id,
                            updated_at: new Date(),
                            created_at: new Date()
                            
                          },function(err,data){
                            if(err) {
                              console.log('error in creating room')
                              cb(null,err);
                            }else {
                              console.log('room created successfully')
                              responseData.data = data;
                              responseData.status = constants.OK;
                              responseData.message = "success";
                              responseData.success = 1;
                              cb(null,responseData);
                            }
                          });

                      } else {
                        //return cb(app.buildError('Error', constants.Bad_Request, messages.roomMsg.invalidHotel, constants.Bad_Request));
                        responseData.data = null;
                        responseData.status = constants.OK;
                        responseData.message = messages.roomMsg.invalidHotel;
                        responseData.success = 0;
                        cb(null,responseData);
                      }
                    }
                  }); 


        }
          
    } 

  }


  Room.remoteMethod('createRoom',
      {
      description: 'Create new Room ',
      http: {path:'/' , verb: 'post'},
      accepts: [{arg: 'data', type: 'object', http: { source: 'body' }}],
      returns: {arg: 'res',root: true, type: 'string',http: { source: 'res' }}
    });


 
Room.fetchAvailableRooms = function(hotel_id,start_date,end_date,cb){
    var roomModel = app.models.Room
    var ds = roomModel.dataSource
    
    var sql = 'select r.id,r.room_type from room r '+ 
              ' where (SELECT COUNT(b.id)  FROM booking b WHERE  '+
              ' b.room_id=r.id AND b.start_date BETWEEN "'+start_date+'" AND "'+end_date+'" '+
              ' and b.end_date BETWEEN "'+start_date+'" AND "'+end_date+'" ) = 0 and r.hotel_id = '+hotel_id;            
              //console.log(sql);
              ds.connector.query(sql, function (err, availableRooms) {
                if(err) {
                  console.log('err')
                  console.log(err)
                  cb(err, null);
                } else {
                    var response = {};
                    //console.log(availableRooms.length)

                    response['data'] = availableRooms;
                    response['totalRooms'] = availableRooms.length;
                    response['status'] = 200;
                    response['message'] = 'success';
                    cb(null,response);
                  
                }
              });
};

Room.remoteMethod('fetchAvailableRooms',
    {
    description: 'Get All the available rooms by hotel Id',
    http: {path:'/fetchAvailableRooms' , verb: 'get'},
    accepts: [
      {arg: 'hotel_id', type: 'number', required:true},
      {arg: 'start_date', type: 'string', required:true},
      {arg: 'end_date', type: 'string', required:true}
      
    ],
    returns: {arg: 'res',root: true, type: 'string',http: { source: 'res' }}
  });
	

};
