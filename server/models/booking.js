'use strict';
var validator = require('validator');
var moment = require('moment');

require('../application/messages');
var constants = require('../../server/application/constants');


function Booking(data) {
  this.room_id = data.room_id;
  this.consumer_id = data.consumer_id;
  this.start_date = data.start_date;
  this.end_date = data.end_date;
  
};

var validationHelper = require('../../server/application/validateUserData');


module.exports = function(Booking) {
  var app = require('../../server/server');

  Booking.disableRemoteMethod("create", true);
  Booking.disableRemoteMethod("upsert", true);
  Booking.disableRemoteMethod("updateAll", true);
  Booking.disableRemoteMethod("updateAttributes", false);
  Booking.disableRemoteMethod("find", true);
  Booking.disableRemoteMethod("findById", true);
  Booking.disableRemoteMethod("findOne", true);
  Booking.disableRemoteMethod("deleteById", true);
  Booking.disableRemoteMethod("confirm", true);
  Booking.disableRemoteMethod("count", true);
  Booking.disableRemoteMethod("exists", true);
  Booking.disableRemoteMethod("resetPassword", true);
  Booking.disableRemoteMethod("createChangeStream", true);
  Booking.disableRemoteMethod("upsertWithWhere", true);
  Booking.disableRemoteMethod("replaceOrCreate", true);
  Booking.disableRemoteMethod("replaceById", true);

  Booking.createBooking=function(data,cb){

    var responseData = {};
    if(Object.getOwnPropertyNames(data).length === 0){
      resp = response.jsonResponse(500,messages.consumerMsg.createConsumer,null);
      cb(null,resp);
    } else {
            var bookObj = new Booking(data); 

            var invalid = false;
            var details = {};

            // console.log(moment(bookObj.end_date).format('YYYY-MM-DD'));
            // console.log(moment(bookObj.start_date).format('YYYY-MM-DD'));
            // return;

            //room_id
            if(bookObj.room_id)
                if(!validator.isNumeric(bookObj.room_id.toString())) {
                  invalid = true;
                  details.room_id = messages.bookMsg.roomIdInvalid;
                }

            //consumer_id
            if(bookObj.consumer_id != undefined && bookObj.consumer_id != null && bookObj.consumer_id != '')
                //bookObj.consumer_id  = validator.isNumeric(bookObj.consumer_id);
                if(!validator.isNumeric(bookObj.consumer_id.toString())) {
                  invalid = true;
                  details.consumer_id = messages.bookMsg.consumerIdInvalid;
                }

            if(invalid){
                  console.log('invalid');
                  return cb(app.buildError('Error', constants.Bad_Request, messages.bookMsg.invalidBookCreateRequest, constants.Bad_Request, details));
            } 
            else 
            {

                  var roomModel = Booking.app.models.Room;
                  var consumerModel = Booking.app.models.Consumer;
                  roomModel.findOne({where: {id: bookObj.room_id} },function(err,room){
                    if(err) {
                      throw err;
                    } else {
                      if(room) {
                              consumerModel.findOne({where: {id: bookObj.consumer_id} },function(err,consumer){
                                if(err) {
                                  throw err;
                                } else {
                                  if(consumer) {

                                            var bookingModel = app.models.Booking
                                            var ds = bookingModel.dataSource
                                            
                                            var sql = 'SELECT ( SELECT COUNT( * ) FROM booking WHERE room_id = '+bookObj.room_id+' AND "'+moment(bookObj.start_date).format('YYYY-MM-DD')+'"  BETWEEN start_date AND end_date) AS start_count, '+
                                                      '( SELECT COUNT( * ) FROM booking WHERE room_id='+bookObj.room_id+' AND "'+moment(bookObj.end_date).format('YYYY-MM-DD')+'" BETWEEN start_date AND end_date) AS end_count, '+
                                                      '( SELECT COUNT( * ) FROM booking WHERE room_id='+bookObj.room_id+' ) AS roomAvailable ';            
                                                      //console.log(sql);
                                                      ds.connector.query(sql, function (err, roomsBooked) {
                                                          //console.log(roomsBooked,roomsBooked[0].start_count,roomsBooked[0].end_count);
                                                          //return;
                                      
                                                          if(err) {
                                                            throw err;
                                                          } else {
                                                            
                                                            if((roomsBooked[0].start_count == 0 && roomsBooked[0].end_count == 0) || roomsBooked[0].roomAvailable == 0) {

                                                                  Booking.create({
                                                                      room_id: bookObj.room_id, 
                                                                      consumer_id: bookObj.consumer_id,
                                                                      start_date: bookObj.start_date,
                                                                      end_date: bookObj.end_date,
                                                                      updated_at: new Date(),
                                                                      created_at: new Date(),
                                                                      status:1
                                                                      
                                                                    },function(err,data){
                                                                      if(err) {
                                                                        console.log('error in creating Booking')
                                                                        cb(null,err);
                                                                      }else {
                                                                        console.log('Booking created successfully')
                                                                        responseData.data = data;
                                                                        responseData.status = constants.OK;
                                                                        responseData.message = "success";
                                                                        responseData.success = 1;
                                                                        cb(null,responseData);
                                                                      }
                                                                    });
                                                              }
                                                              else
                                                              {
                                                                  responseData.data = null;
                                                                  responseData.status = constants.OK;
                                                                  responseData.message = "Room is Already Booked for given time period";
                                                                  responseData.success = 0;
                                                                  cb(null,responseData);

                                                              } 
                                                            
                                                          }
                                                    });

                                } 
                                else {
                                  //return cb(app.buildError('Error', constants.Bad_Request, messages.bookMsg.invalidConsumer, constants.Bad_Request));
                                  responseData.data = null;
                                  responseData.status = constants.OK;
                                  responseData.message = messages.bookMsg.invalidConsumer;
                                  responseData.success = 0;
                                  cb(null,responseData);
                                }

                              }
                            });


                      } else {
                        //return cb(app.buildError('Error', constants.Bad_Request, messages.bookMsg.invalidRoom, constants.Bad_Request));
                        responseData.data = null;
                        responseData.status = constants.OK;
                        responseData.message = messages.bookMsg.invalidRoom;
                        responseData.success = 0;
                        cb(null,responseData);
                      }
                    }
                  }); 


            }     
    }




  }

  Booking.remoteMethod('createBooking',
    {
    description: 'Create new Booking ',
    http: {path:'/' , verb: 'post'},
    accepts: [{arg: 'data', type: 'object', http: { source: 'body' }}],
    returns: {arg: 'res',root: true, type: 'string',http: { source: 'res' }}
  });



  

};
