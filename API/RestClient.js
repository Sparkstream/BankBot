var request = require('request');

//The RestClient prepares the parameters that are required to be sent for a GET/POST Request


exports.getExchangeRates = function getData(url,session,callback){

    request.get(url,function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else{
            callback(body,session);
        }
   
    });
};