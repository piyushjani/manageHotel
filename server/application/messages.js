'use strict';
global.messages = {
    consumerMsg: {
        createConsumer: 'Please Enter Details to Create Consumer',
        consumerUpdateFail:"Consumer Updation Failed mobile number does not exist",
        emailInvalid:"Consumer Email Id has to be proper",
        invalidConsumerUpdateRequest: 'The consumer instance is not valid!!',
        
    },
    hotelMsg:{
        createHotel: 'Please Enter Details to Create Consumer',
        hotelUpdateFail:"Hotel Updation Failed id does not exist",
        invalidHotelUpdateRequest: 'The hotel instance is not valid!!',


    },
    roomMsg:{
        bedsInvalid:'Number of Beds has to be Numeric',
        priceInvalid:'The Price of Rooms Has to be Numeric',
        hotelIdInvalid:'Hotel Id Has to be Numeric',
        invalidHotel:'hotel does not exist with given hotel id',
        invalidRoomCreateRequest:'The Room instance is not valid!!'
    },
    bookMsg:{
        roomIdInvalid:'Room Id has to be numeric',
        consumerIdInvalid:'Consumer Id has to be numeric',
        invalidBookCreateRequest:'The Booking instance is not valid!!',
        invalidConsumer:'Consumer does not exist with given consumer id',
        invalidRoom:'Room does not exist with given room id',
    }
};